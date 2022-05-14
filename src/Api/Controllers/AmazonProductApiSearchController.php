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
        $asin = isset($request->getQueryParams()['asin']) ? $request->getQueryParams()['asin'] : null;
        $locale = isset($request->getQueryParams()['locale']) ? $request->getQueryParams()['locale'] : null;

        if (!$asin) {
            return new JsonResponse(['exception' => 'no asin']);
        }

        // if (!$locale) {
        //     return new JsonResponse(['exception' => 'no locale']);
        // }

        $searchItemRequest = new SearchItemsRequest();
        $searchItemRequest->PartnerType = "Associates";
        // Put your Partner tag (Store/Tracking id) in place of Partner tag
        // $searchItemRequest->Marketplace = "www.amazon.de";
        $searchItemRequest->Marketplace = "www.amazon.de";
        // $searchItemRequest->Marketplace = "www.amazon.it";
        // $searchItemRequest->PartnerTag = "dvdnarr.com-21";
        $searchItemRequest->PartnerTag = $this->settings->get('wd-amazon-product-api.partnerTag');
        // $searchItemRequest->Keywords = "Harry";
        $searchItemRequest->Keywords = $asin;
        $searchItemRequest->SearchIndex = "All";
        $searchItemRequest->Resources = [
            "Images.Primary.Large",
            // "Images.Variants.Large",
            // "ItemInfo.ByLineInfo",
            // "ItemInfo.Features",
            // "ItemInfo.ProductInfo",
            // "ItemInfo.TechnicalInfo",
            "ItemInfo.Title",
            "Offers.Listings.Price",
            "SearchRefinements",
        ];
        // $searchItemRequest->Resources = [];
        // $host = "webservices.amazon.com";
        $host = "webservices.amazon.de";
        // $host = "webservices.amazon.it";
        $path = "/paapi5/searchitems";
        $payload = json_encode($searchItemRequest);
        // Put your Access Key in place of <ACCESS_KEY> and Secret Key in place of <SECRET_KEY> in double quotes
        $awsv4 = new AwsV4($this->settings->get('wd-amazon-product-api.accessKey'), $this->settings->get('wd-amazon-product-api.secretKey'));
        // $awsv4->setRegionName("us-east-1");
        $awsv4->setRegionName("eu-west-1");
        // $awsv4->setRegionName("eu-central-1");
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
            // $headerString .= $key . ': ' . $value . "\n";
        }
        $params = array(
            'http' => array (
                'header' => $headerString,
                'method' => 'POST',
                'content' => $payload
            )
        );
        $stream = stream_context_create($params);

        $fp = @fopen('https://'.$host.$path, 'rb', false, $stream);

        if (!$fp) {
            // throw new Exception("Exception Occured");
            // return new JsonResponse(['exception' => 'no effing fopen return', 'stream' => json_encode($params)]);
            return new JsonResponse(['exception' => 'no results']);
        }
        $response = @stream_get_contents($fp);
        if ($response === false) {
            // throw new Exception("Exception Occured");
            return new JsonResponse(['exception' => 'no RESPONSE return']);
        }
        // echo $response;
        $resultObject = json_decode($response, true);
        // $result
        // print_r($resultObject['SearchResult']['Items'][0]['ASIN']);

        return new JsonResponse([
            // 'asin' => $asin,
            // 'locale' => $locale,
            'resultUrl'     => substr($resultObject['SearchResult']['Items'][0]['DetailPageURL'], 0, strpos($resultObject['SearchResult']['Items'][0]['DetailPageURL'], '?')),
            'resultImage'   => $resultObject['SearchResult']['Items'][0]['Images']['Primary']['Large']['URL'],
            'resultTitle'   => $resultObject['SearchResult']['Items'][0]['ItemInfo']['Title']['DisplayValue'],
            'resultPrice'   => $resultObject['SearchResult']['Items'][0]['Offers']['Listings'][0]['Price']['DisplayAmount'],
            'resultObject'  => $resultObject,
        ]);
    }
}
