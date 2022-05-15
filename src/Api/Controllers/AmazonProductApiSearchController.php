<?php

namespace WD\AmazonProductApi\Api\Controllers;

use WD\AmazonProductApi\AwsV4;
use Flarum\Settings\SettingsRepositoryInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface;

class SearchItemsRequest {
    public $PartnerType;
    public $PartnerTag;
    public $Keywords;
    public $SearchIndex;
    public $Resources;
}

class AmazonProductApiSearchController implements RequestHandlerInterface
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /*
     * @param Request $request
     * @return Response
     */
    public function handle(Request $request): Response
    {
        $amzWebservices = array(
            'de' => array('host' => 'webservices.amazon.de', 'region' => 'eu-west-1', 'marketplace' => 'www.amazon.de'),
            'fr' => array('host' => 'webservices.amazon.fr', 'region' => 'eu-west-1', 'marketplace' => 'www.amazon.fr'),
            'it' => array('host' => 'webservices.amazon.it', 'region' => 'eu-west-1', 'marketplace' => 'www.amazon.it'),
            'uk' => array('host' => 'webservices.amazon.co.uk', 'region' => 'eu-west-1', 'marketplace' => 'www.amazon.co.uk'),
            'us' => array('host' => 'webservices.amazon.us', 'region' => 'us-east-1', 'marketplace' => 'www.amazon.us'),
        );
        $asin = isset($request->getQueryParams()['asin']) ? $request->getQueryParams()['asin'] : null;
        $country = isset($request->getQueryParams()['country']) ? $request->getQueryParams()['country'] : null;

        if (!$asin) {
            return new JsonResponse(['exception' => 'no-asin']);
        }

        if (!$country) {
            return new JsonResponse(['exception' => 'no-country']);
        }

        if (!$this->settings->get('wd-amazon-product-api.partnerTag.'.$country)) {
            return new JsonResponse(['exception' => 'undefined-partnerTag']);
        }

        // create search item request
        $searchItemRequest = new SearchItemsRequest();
        $searchItemRequest->PartnerType = "Associates";
        $searchItemRequest->PartnerTag = $this->settings->get('wd-amazon-product-api.partnerTag.'.$country);
        $searchItemRequest->Marketplace = $amzWebservices[$country]['marketplace'];
        $searchItemRequest->Keywords = $asin;
        $searchItemRequest->SearchIndex = "All";
        $searchItemRequest->Availability = "IncludeOutOfStock";
        $searchItemRequest->Resources = [
            "Images.Primary.Large",
            "Images.Variants.Large",
            // "ItemInfo.ByLineInfo",
            // "ItemInfo.Features",
            // "ItemInfo.ProductInfo",
            // "ItemInfo.TechnicalInfo",
            "ItemInfo.Title",
            "Offers.Listings.Price",
            "SearchRefinements",
        ];
        $payload = json_encode($searchItemRequest);

        // host & path
        $host = $amzWebservices[$country]['host'];
        $path = "/paapi5/searchitems";

        // AWS Signature Version 4 code to sign request to AWS
        $awsv4 = new AwsV4($this->settings->get('wd-amazon-product-api.accessKey'), $this->settings->get('wd-amazon-product-api.secretKey'));
        $awsv4->setRegionName($amzWebservices[$country]['region']);
        $awsv4->setServiceName("ProductAdvertisingAPI");
        $awsv4->setPath($path);
        $awsv4->setPayload($payload);
        $awsv4->setRequestMethod("POST");
        $awsv4->addHeader('content-encoding', 'amz-1.0');
        $awsv4->addHeader('content-type', 'application/json; charset=utf-8');
        $awsv4->addHeader('host', $host);
        $awsv4->addHeader('x-amz-target', 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems');
        $headers = $awsv4->getHeaders();

        $headerString = "";
        foreach ($headers as $key => $value) {
            $headerString .= $key . ': ' . $value . "\r\n";
        }
        $params = array(
            'http' => array (
                'header' => $headerString,
                'method' => 'POST',
                'content' => $payload
            )
        );
        $stream = stream_context_create($params);

        // Request Amazon Product Advertising API
        try {
            $fp = @fopen('https://'.$host.$path, 'rb', false, $stream);
        } catch (\Throwable $th) {
            return new JsonResponse(['exception' => 'api-connection-error']);
        }

        try {
            $response = @stream_get_contents($fp);
        } catch (\Throwable $th) {
            return new JsonResponse(['exception' => 'no-response-return']);
        }

        // return results
        $resultObject = json_decode($response, true);
        if ($resultObject == null) {
            // probably no qualified sales on partnerTag
            return new JsonResponse(['exception' => 'no-results-null']);
        } else if ($resultObject['Errors']) {
            return new JsonResponse([
                'exception'     => 'no-results-error',
                'resultObject'  => $resultObject
            ]);
        } else {
            return new JsonResponse([
                'resultUrl'     => substr($resultObject['SearchResult']['Items'][0]['DetailPageURL'], 0, strpos($resultObject['SearchResult']['Items'][0]['DetailPageURL'], '?')),
                'resultImage'   => $resultObject['SearchResult']['Items'][0]['Images']['Primary']['Large']['URL'],
                'resultTitle'   => $resultObject['SearchResult']['Items'][0]['ItemInfo']['Title']['DisplayValue'],
                'resultPrice'   => $resultObject['SearchResult']['Items'][0]['Offers']['Listings'][0]['Price']['DisplayAmount'],
                'resultObject'  => $resultObject
            ]);
        }
    }
}
