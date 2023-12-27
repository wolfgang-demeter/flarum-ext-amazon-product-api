<?php

namespace WD\AmazonProductApi\Api\Controllers;

use WD\AmazonProductApi\AwsV4;
use Flarum\Settings\SettingsRepositoryInterface;
use GuzzleHttp\Client as GuzzleHttpClient;
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
            'ca' => array('host' => 'webservices.amazon.ca', 'region' => 'us-east-1', 'marketplace' => 'www.amazon.ca'),
            'de' => array('host' => 'webservices.amazon.de', 'region' => 'eu-west-1', 'marketplace' => 'www.amazon.de'),
            'es' => array('host' => 'webservices.amazon.es', 'region' => 'eu-west-1', 'marketplace' => 'www.amazon.es'),
            'fr' => array('host' => 'webservices.amazon.fr', 'region' => 'eu-west-1', 'marketplace' => 'www.amazon.fr'),
            'it' => array('host' => 'webservices.amazon.it', 'region' => 'eu-west-1', 'marketplace' => 'www.amazon.it'),
            'uk' => array('host' => 'webservices.amazon.co.uk', 'region' => 'eu-west-1', 'marketplace' => 'www.amazon.co.uk'),
            'us' => array('host' => 'webservices.amazon.com', 'region' => 'us-east-1', 'marketplace' => 'www.amazon.com'),
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
            // "Images.Variants.Large",
            // "ItemInfo.ByLineInfo",
            // "ItemInfo.ContentInfo",
            // "ItemInfo.ContentRating",
            // "ItemInfo.Features",
            // "ItemInfo.ManufactureInfo",
            // "ItemInfo.ProductInfo",
            // "ItemInfo.TechnicalInfo",
            "ItemInfo.Title",
            "Offers.Listings.Price",
            "Offers.Listings.SavingBasis",
            // "SearchRefinements",
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

        // fallback URL fro HTML parsing
        $fallbackParsingUrl = 'https://'.$amzWebservices[$country]['marketplace'].'/dp/'.$asin;

        // Request Amazon Product Advertising API
        try {
            $fp = @fopen('https://'.$host.$path, 'rb', false, $stream);
        } catch (\Throwable $th) {
            return $this->handleHtmlParsingFallback($fallbackParsingUrl);
            // return new JsonResponse(['exception' => 'api-connection-error']);
        }

        try {
            $response = @stream_get_contents($fp);
        } catch (\Throwable $th) {
            return $this->handleHtmlParsingFallback($fallbackParsingUrl);
            // return new JsonResponse(['exception' => 'no-response-return']);
        }

        // return results
        $resultObject = json_decode($response, true);
        if ($resultObject == null) {
            return $this->handleHtmlParsingFallback($fallbackParsingUrl);
            // probably no qualified sales on partnerTag
            // return new JsonResponse(['exception' => 'no-results-null']);
        } else if ($resultObject['Errors']) {
            return $this->handleHtmlParsingFallback($fallbackParsingUrl);
            // return new JsonResponse([
            //     'exception'     => 'no-results-error',
            //     'resultObject'  => $resultObject
            // ]);
        } else {
            return new JsonResponse([
                'resultUrl'         => substr($resultObject['SearchResult']['Items'][0]['DetailPageURL'], 0, strpos($resultObject['SearchResult']['Items'][0]['DetailPageURL'], '?')),
                'resultImage'       => $resultObject['SearchResult']['Items'][0]['Images']['Primary']['Large']['URL'],
                'resultTitle'       => $resultObject['SearchResult']['Items'][0]['ItemInfo']['Title']['DisplayValue'],
                'resultPrice'       => str_replace('.', ',', $resultObject['SearchResult']['Items'][0]['Offers']['Listings'][0]['Price']['DisplayAmount']),
                'resultSavings'     => str_replace('.', ',', $resultObject['SearchResult']['Items'][0]['Offers']['Listings'][0]['Price']['Savings']['DisplayAmount']),
                'resultSavingBasis' => str_replace('.', ',', $resultObject['SearchResult']['Items'][0]['Offers']['Listings'][0]['SavingBasis']['DisplayAmount']),
                'resultObject'      => $resultObject
            ]);
        }
    }

    private function handleHtmlParsingFallback($resultUrl)
    {
        $guzzleClient = new GuzzleHttpClient();
        $guzzleResponse = $guzzleClient->request('GET', $resultUrl);

        if ($guzzleResponse->getStatusCode() != 200) {
            return new JsonResponse(['exception' => 'html-parsing-fallback-error']);
        }

        // HTML is often wonky, this suppresse a lot of warnings
        libxml_use_internal_errors(true);

        $parsedHtml = new \DOMDocument();
        $parsedHtml->loadHTML((string)$guzzleResponse->getBody());
        $xpath = new \DOMXPath($parsedHtml);

        // Image
        if ($xpath->query('//img[@id="landingImage"]')->item(0)) {
            $resultImage = str_replace('_SL1500_', '_SL500_', $xpath->query('//img[@id="landingImage"]')->item(0)->getAttribute('data-old-hires'));
            if (!$resultImage) {
                $resultImage = str_replace('_SX300_SY300_QL70_ML2_', '_SL500_', $xpath->query('//img[@id="landingImage"]')->item(0)->getAttribute('src'));
            }
            if (!$resultImage) {
                $resultImage = str_replace('_SX342_', '_SL500_', $xpath->query('//img[@id="landingImage"]')->item(0)->getAttribute('src'));
            }
        } else {
            $resultImage = null;
        }

        // Title
        $resultTitle = trim($xpath->query('//span[@id="productTitle"]')->item(0)->nodeValue);

        if (!$resultImage || !$resultTitle) {
            return new JsonResponse(['exception' => 'html-parsing-fallback-error']);
        }

        return new JsonResponse([
            'resultUrl'     => $resultUrl,
            'resultImage'   => $resultImage,
            'resultTitle'   => $resultTitle,
        ]);
    }
}
