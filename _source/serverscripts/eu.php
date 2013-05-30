<?php

/** This file is part of muse-opensource
  *
  *      @desc Main admin code
  *   @package muse-open-source
  *    @author Jonathan Carter <jc@glimworm.com>
  * @copyright 2013 glimworm IT BV
  *   @license http://www.opensource.org/licenses/gpl-2.0.php GPLv2
  *   @license http://www.opensource.org/licenses/lgpl-2.1.php LGPLv2
  *      @link http://www.muse-opensource.org
  */
  
error_reporting(-1);


class obj {
}
function Q($S) {
	return "'" . $S . "'";
}
function QQ($S) {
	return "'" . mysql_real_escape_string($S) . "'";
}

function array_or_string($itm) {
	return (is_array($itm)) ? $itm[0] : $itm;
}

function prepare_image_url($img) {
	try {
		if ($img && $img != null && strpos($img, "memorix")) {
//			http://na.memorix.nl/oai2/?image=na:col1:dat491224:134_0392.jpg&type=large")
			return ("http://europeanastatic.eu/api/image?uri=". urlencode($img) ."&size=LARGE&type=TEXT");
		}
	} catch (Exception $e) {		
		return $img;
	}
	return $img;
		
}



if ($_GET["action"] == "") $_GET = $_POST;
$action = $_GET['action'];

if ($action == "json-srch") {
	$srch = $_GET['srch'];
	$typ = $_GET['type'];
	$start = $_GET['start'];
	$page = $_GET['page'];
	$query = $_GET['query'];
	get_data($srch,$typ,$start,$page,$query); //dumps the content, you can manipulate as you wish to
	exit;

} else if ($action == "json-get") {
	$identifier = $_GET['identifier'];
	get_item($identifier); //dumps the content, you can manipulate as you wish to
	exit;
} else if ($action == "json-addlink") {
	$a = $_GET['a'];
	$b = $_GET['b'];
	$type = $_GET['type'];
	$comment = $_GET['comment'];
	addlink($a, $b, $type, $comment); //dumps the content, you can manipulate as you wish to
	exit;

} else if ($action == "get-featured") {
	get_featured_items();
	exit;

} else {
	echo $action;
	
}

function get_featured_items() {

	$jsontxt = file_get_contents("eu_featured_items.json");
	$items = json_decode($jsontxt);
	
	$f = new obj();
	$retval = new obj();
	$retval->status = 0;
	$retval->status_msg = "searched";
	$retval->data = new obj();
	$retval->data->jsontxt = $jsontxt;
	$retval->data->items = $items;
	echo json_encode($retval);
	

}

	
function L($S) {
	static $lang = array(
		"en" => "English",
		"e404" => "from server.. This search gives no results, please try another search term"
	);
	if ($lang[$S]) return $lang[$S];
	return $S;
}
function isin($typ,$qf) {
	if (strpos("&".$typ."&",$qf."&")) return 1;
	return 0;
}

function get_data($srch,$typ,$start,$page,$query)
{

		//http://europeana.eu/api/v2/search.json?query=Somme&rows=100&start=1&wskey={EUROPEANA_KEY}
		$i = rand(1,7);
		$i = 1;
		$LINESPERPAGE = 100;
		
		if (!$start || $start == "") $start = "1";
		if (!$page || $page == "") $page = 0;
		$start = ($page * $LINESPERPAGE) + 1;
		
		
		// this is europeana's everything search
		if ($srch == null || $srch == "") $srch = "*:*";
		
		$hide = "RIGHTS";
		if ($query != "") {
		
			$jsontxt = file_get_contents("eu_featured_items.json");
			$fitems = json_decode($jsontxt);
			$fitem = $fitems[$query];
			$typ = $typ . $fitem->hiddenquery;
			$hide = $fitem->hide;
		} else {
			$hide = "RIGHTS,DATA_PROVIDER,PROVIDER,TYPE";
			$typ = $typ . "&qf=TYPE:IMAGE";
			$typ = $typ . "&qf=DATA_PROVIDER:\"Cat%C3%A1logo+Colectivo+de+la+Red+de+Bibliotecas+de+los+Archivos+Estatales\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"Biblioteca+Virtual+del+Patrimonio+Bibliogr%C3%A1fico\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"Biblioteca+Virtual+del+Ministerio+de+Defensa\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"Rijksmuseum\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"Институт+за+балканистика+с+Център+по+тракология\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"Central+Library+of+Bulgarian+Academy+of+Sciences\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"Museu+Nacional+de+Arqueologia\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"The+Royal+Botanic+Garden+Edinburgh\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"University+of+Tartu,+Natural+History+Museum\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"Museum+of+Geology,+University+of+Tartu\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"The+National+Library+of+Poland+-+Biblioteka+Narodowa\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"Biblioteca+Valenciana+Digital\"";
			$typ = $typ . "&qf=DATA_PROVIDER:\"Fondo+Fotográfico+de+la+Universidad+de+Navarra\"";
			

		}
		
		
		
		$url='http://europeana.eu/api/v2/search.json?query='.$srch.'&rows='.$LINESPERPAGE.'&start='.$start.'&wskey={EUROPEANA_KEY}&profile=portal'.$typ;
//		$url = $url . "&profile=portal"
		// query=*:*
		// &qf=DATA_PROVIDER:"Catálogo+Colectivo+de+la+Red+de+Bibliotecas+de+los+Archivos+Estatales"
		// &qf=TYPE:IMAGE
		// &profile=portal
		
		$ch = curl_init();
		$timeout = 30;
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
		$data = curl_exec($ch);
		$data = json_decode($data);
		
		$totalitems = array();
		$types = array();
		
		error_log($url);
		error_log($data);
		
		foreach ($data->items as $itm) {
			
			$ok = false;
			if ($typ && $typ != "") {
				if ($typ == $itm->type) $ok = true;
			} else { 
				if ($itm->type == "VIDEO" || $itm->type == "IMAGE" || $itm->type == "TEXT") $ok = true;
			}
			$ok = true;
			
			if ($ok == true) {
				$item = new obj();	
				$item->id = $itm->id;
				$item->url = $itm->link;
				$item->image = (is_array($itm->edmPreview)) ? $itm->edmPreview[0] : $itm->edmPreview;
				$item->enclosure = (is_array($itm->edmPreview)) ? $itm->edmPreview[0] : $itm->edmPreview;
				$item->guid = $itm->guid;
				$item->title = $itm->title[0];
				$item->description = "";
				$item->type = $itm->type;
				$item->rights = $itm->rights;
				
//				$item->image = prepare_image_url($item->image);
//				$item->enclosure = prepare_image_url($item->enclosure);

				array_push($totalitems , $item);
			}
			
//			array_push($types , $itm->type);
			

		}

//		$types = array_unique($types);

/*
		array_push($types , "#total results : ".$data->totalResults);
		array_push($types , "#url : ".$url);
		array_push($types , "#pages : ");
		array_push($types , "&start=1|1");
		array_push($types , "&start=2|2");
*/


		if ($data->facets) {
			foreach ($data->facets as $facet) {
			
				if (!strpos((",,".$hide.",") , (",".$facet->name.","))) {

					$section_head_not_added = true;
					foreach ($facet->fields as $field) {
						$xxx = "";
						$x = isin($typ,"&qf=".$facet->name.":\"".urlencode($field->label)."\"");	// match quote
						$xx = isin($typ,"&qf=".$facet->name.":".urlencode($field->label)."");		// match noquote
						$x1 = isin($typ,"&qf=".$facet->name.":\"".($field->label)."\"");
						$xx1 = isin($typ,"&qf=".$facet->name.":".($field->label).""); // match no quote
						$xxx = "[".$x."-".$xx."-".$x1."-".$xx1."]";
						$xcnt = ($x+$xx+$x1+$xx1);
						/* exclude the option is already selected in the types */
						if ($xcnt == 0) {
							if ($section_head_not_added == true) {
								//array_push($types , "#_".$facet->name." ".$hide);
								array_push($types , "#".$facet->name);
								$section_head_not_added = false;
							}
							if (strpos($field->label," ")) {
								array_push($types , "&qf=".$facet->name.":\"".urlencode($field->label)."\"|".$field->label . " (".$field->count.")");
							} else {
								array_push($types , "&qf=".$facet->name.":".urlencode($field->label)."|".$field->label . " (".$field->count.")");
							}
						}
					}
				}
			}
		}

		$retval = new obj();
		$retval->status = 0;
		$retval->status_msg = ("success ".count($totalitems)." results");
		$retval->data = new obj();
		$retval->data->items = $totalitems;
		$retval->data->types = $types;
		$retval->data->totalResults = $data->totalResults;
		$retval->data->perpage = $LINESPERPAGE;
		$retval->data->url = $url;
		$retval->data->status_msg = (count($totalitems) == 0) ? L("e404") : "";
		
		
		echo json_encode($retval);

}
function A($arr) {
	$rv = "";
	$comma = "";
	foreach($arr as $a) {
		$rv = $rv . $comma .$a;
		$comma = ",";
	}
	return $a;
}
function PL($prefLabel) {

	if ($prefLabel->en) return $prefLabel->en[0];
	if ($prefLabel->def) return $prefLabel->def[0];
	if ($prefLabel->nl) return $prefLabel->nl[0];
	return "..";
}
function itm($identifier,$url,$comment,$type) {
	$item2 = new obj();
	$item2->id = "";
	$item2->identifier = $identifier;
	$item2->url = $url;
	$item2->type = $type;
	$item2->comment = $comment;
	$item2->uid = "";
	$item2->ts = "";
	return $item2;
}

function mta($L, $V) {
	$item2 = new obj();
	$item2->label = $L;
	$item2->value = $V;
	return $item2;
}


function get_links($itm) {
	$links = array();
		foreach ($itm->agents  as $ag) {
			$item2 = new obj();
			$item2->id = "";
			$item2->identifier = $identifier;
			$item2->url = $ag->about;
			$item2->type = "who";
			$item2->comment = PL($ag->prefLabel);
			$item2->uid = "";
			$item2->ts = "";
			array_push($links , $item2);
		}
		foreach ($itm->aggregations  as $ag) {
			$item2 = new obj();
			$item2->id = "";
			$item2->identifier = $identifier;
			$item2->url = $ag->webResources[0]->about;
			$item2->type = "general link";
			$item2->comment = PL($ag->edmDataProvider);
			$item2->uid = "";
			$item2->ts = "";
			array_push($links , $item2);
		}
		$eua = $itm->europeanaAggregation;
//		array_push($links , itm($identifier,$eua->about,"aggregation","general link"));
		array_push($links , itm($identifier,$eua->edmLandingPage,"View in Europeana","general link"));
//		array_push($links , itm($identifier,array_or_string($eua->edmPreview),"Preview","general link"));
		
		
		foreach ($itm->timespans  as $ag) {
			$item2 = new obj();
			$item2->id = "";
			$item2->identifier = $identifier;
			$item2->url = $ag->about;
			$item2->type = "when";
			$item2->comment = PL($ag->prefLabel);
			$item2->uid = "";
			$item2->ts = "";
			array_push($links , $item2);
		}
		
		return $links;
}
function getLandingPage($itm) {
	$eua = $itm->europeanaAggregation;
	return $eua->edmLandingPage;
}
function  get_euro_itm($identifier) {
		$url='http://europeana.eu/api/v2/record'.$identifier.'.json?wskey={EUROPEANA_KEY}';
		$ch = curl_init();
		$timeout = 30;
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
		$data = curl_exec($ch);
		$data = json_decode($data);
		return $data->object;
}

function get_item($identifier)
{

		$url='http://europeana.eu/api/v2/record'.$identifier.'.json?wskey={EUROPEANA_KEY}';
		$ch = curl_init();
		$timeout = 30;
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
		$data = curl_exec($ch);
		$data = json_decode($data);
		
		$totalitems = array();
		$itm = $data->object;
			
		$item = new obj();	
		$item->id = $itm->about;
		$item->identifier = $item->id;
		$item->type = $itm->type;
		foreach ($itm->aggregations as $itm1) {
			$item->img = $itm1->edmObject;
		}
		$item->img = prepare_image_url($item->img);
		
		$item->title = array_or_string($itm->title);
		
			
		/*$desc = $itm->proxies[0]->dcSubject->def[0];
			
		if ($desc == null){*/
			$desc=$itm->proxies[0]->dcDescription->def[0];
		//}
			
		$item->description = $desc;
			//$item->creator = $itm->agents[0]->prefLabel[0]->en;
		array_push($totalitems , $item);
		
		$met = array();
		$links = array();


	$dbhost = "localhost";
	$username = "root";
	$password = "{password}";
	$database = "muse";
	$db = mysql_connect($dbhost,$username,$password);
	mysql_select_db($database) or die("Unable to select database");
	mysql_query("SET NAMES utf8", $db);
	mysql_query( "SET CHARACTER SET utf8", $db );


		$query3="select * from eu_link where identifier = '" . $identifier .  "' order by type";
		$result3=mysql_query($query3);
		for ($r=0; $r < mysql_numrows($result3); $r++) {

			$item2 = new obj();
			$item2->id = mysql_result($result3,$r,"id");
			$item2->identifier = mysql_result($result3,$r,"identifier");
			$item2->url = mysql_result($result3,$r,"url");
			$item2->type = strtolower(mysql_result($result3,$r,"type"));
			$item2->comment = mysql_result($result3,$r,"comment");
			$item2->uid = mysql_result($result3,$r,"uid");
			$item2->ts = mysql_result($result3,$r,"ts");
			array_push($links , $item2);
		}
		$links = array_merge($links , get_links($itm));
		
		$eua = $itm->europeanaAggregation;


		/* list of fields from david's email */


		$item2 = new obj();
		$item2->label = "Title";
		$item2->value = A($itm->proxies[0]->dcTitle->def);
//		if ($item2->value != "") array_push($met , $item2);
		
		$item2 = new obj();
		$item2->label = "Creator";
		$item2->value = A($itm->proxies[0]->dcCreator->def);
		if ($item2->value != "") {
			array_push($met , $item2);
			$item->ccsearchterm = $item2->value;

		}

		$item2 = mta("Type",$itm->type);
		if ($item2->value != "") array_push($met , $item2);

		$item2 = new obj();
		$item2->label = "Created";
		$item2->value = A($itm->proxies[0]->dctermsCreated->def);
		if ($item2->value != "") array_push($met , $item2);

		$item2 = new obj();
		$item2->label = "Rights";
		$item2->value = A($itm->proxies[0]->dcRights->def);
		if ($item2->value != "") array_push($met , $item2);

		$item2 = new obj();
		$item2->label = "Type";
		$item2->value = A($itm->proxies[0]->dcType->def);
		if ($item2->value != "") array_push($met , $item2);


		/* end : list of fields from david's email */


		$item2 = mta("Rights","§".$eua->edmRights->def);
		if ($item2->value != "") array_push($met , $item2);

		$item2 = mta("Rights",$eua->edmRights->def);
		if ($item2->value != "") array_push($met , $item2);


		$item2 = mta("Language",PL($eua->edmLanguage));
		if ($item2->value != "") array_push($met , $item2);

		$item2 = mta("Country",PL($eua->edmCountry));
		if ($item2->value != "") array_push($met , $item2);

		$item2 = mta("Collection Name",A($eua->edmCollectionName));
		if ($item2->value != "") array_push($met , $item2);
		

		$item2 = new obj();
		$item2->label = "Contributor";
		$item2->value = A($itm->proxies[0]->dcContributor->def);
		if ($item2->value != "") array_push($met , $item2);


		$item2 = new obj();
		$item2->label = "Format";
		$item2->value = A($itm->proxies[0]->dcFormat->def);
		if ($item2->value != "") array_push($met , $item2);


		$item2 = new obj();
		$item2->label = "Source";
		$item2->value = A($itm->proxies[0]->dcSource->def);
		if ($item2->value != "") array_push($met , $item2);




		$item2 = new obj();
		$item2->label = "Extent";
		$item2->value = A($itm->proxies[0]->dctermsExtent->def);
		if ($item2->value != "") array_push($met , $item2);

		$item2 = new obj();
		$item2->label = "Part of";
		$item2->value = A($itm->proxies[0]->dctermsIsPartOf->def);
		if ($item2->value != "") array_push($met , $item2);

		$item2 = new obj();
		$item2->label = "Issued";
		$item2->value = A($itm->proxies[0]->dctermsIssued->def);
		if ($item2->value != "") array_push($met , $item2);

		$item2 = new obj();
		$item2->label = "Medium";
		$item2->value = A($itm->proxies[0]->dctermsMedium->def);
		if ($item2->value != "") array_push($met , $item2);

		$item2 = mta("Rights","§o");
		array_push($met , $item2);

//		$item2 = mta("Europeana identifier",$identifier);
//		array_push($met , $item2);


		
		$desc=$itm->proxies[0]->dcDescription->def[0];




		$item->twitter_image = "http://www.europeana.eu/portal/sp/img/europeana-logo-en.png";
		$item->twitter_text = $item->title;
		$item->twitter_link = getLandingPage($itm);	//"http://www.europeana.eu/";
		
		$item->ccsearchterm = $item->title;
		$item->facebook_appid = "185778248173748";	//"333368490063557";


		$item->ccwikipedia = "http://en.wikipedia.org/wiki/". str_replace(" ","_",$item->ccsearchterm);
		$item->ccwikipediasearch = "http://en.wikipedia.org/wiki/Special:Search?search=".urlencode($item->ccsearchterm)."&go=Go";
		$item->ccgooglesearch = "http://www.google.com/search?q=".urlencode($item->ccsearchterm);
		
//		$item->button2 = "images/glyphicons_382_youtube1.png";
//		$item->button2_link = "http://www.youtube.com/?nomobile=1&svr=y";
//		$item->button3 = "/images/glyphicons_395_flickr.png";
//		$item->button3_link = "http://www.flickr.com/?svr=y";

		$item->button2 = "images/wikipedia.png";
		$item->button2_link = "http://en.wikipedia.org/wiki/Special:Search?search=".urlencode($item->ccsearchterm)."&go=Go";

		$item->button3 = "/images/wikimedia.png";
		$item->button3_link = "http://commons.wikimedia.org/wiki/Special:Search?search=".urlencode($item->ccsearchterm)."&go=Go";
		
		
//		$links2 = array();
//		foreach ($itm->aggregations  as $agg) {
//			foreach ($agg->webResources as $wr) {
//				array_push($links2 , $wr);
//			}
//		}
		

		$retval = new obj();
		$retval->status = 0;
		$retval->status_msg = "searched";
		$retval->data = $totalitems;
		$retval->data1 = new obj();
		$retval->data1->buts = array();
		$but1->title = "";
		$but1->url = "";
		$retval->data1->links = $links;
		$retval->data1->meta = $met;
//		$retval->data1->links2 = $links2;
		$retval->data1->original = $data;
//		$retval->data1->aggregations = $itm->aggregations;
		echo json_encode($retval);
		
}


function addlink($a, $b, $type, $comment) {

	$dbhost = "localhost";
	$username = "root";
	$password = "{password}";
	$database = "muse";
	$db = mysql_connect($dbhost,$username,$password);
	mysql_select_db($database) or die("Unable to select database");
	mysql_query("SET NAMES utf8", $db);
	mysql_query( "SET CHARACTER SET utf8", $db );
	
	/*
	
	database format
	===============
	
	drop table if exists rijksmuseum_link;
	create table rijksmuseum_link (
	id int(6) NOT NULL AUTO_INCREMENT,
	ts timestamp not null default 0,
	identifier varchar(255) not null default '',
	url varchar(255) not null default '',
	type varchar(255) not null default '',
	comment varchar(255) not null default '',
	uid varchar(255) not null default '',
	primary key (id)
	) ENGINE=MyISAM DEFAULT CHARSET=utf8;


	*/
	$s = "insert into eu_link  (id,ts,identifier,url,type,comment,uid) values (0,now() ";
	$s = $s . "," . Q($a);
	$s = $s . "," . Q($b);
	$s = $s . "," . Q(strtolower($type));
	$s = $s . "," . Q(mysql_escape_string($comment));
	$s = $s . ",'');";
	
	$result=mysql_query($s);
	
	
	$links = array();
		$query3="select * from eu_link where identifier = '" . ($a) .  "' order by type";
		$result3=mysql_query($query3);
		for ($r=0; $r < mysql_numrows($result3); $r++) {

			$item2 = new obj();
			$item2->id = mysql_result($result3,$r,"id");
			$item2->identifier = mysql_result($result3,$r,"identifier");
			$item2->url = mysql_result($result3,$r,"url");
			$item2->type = strtolower(mysql_result($result3,$r,"type"));
			$item2->comment = mysql_result($result3,$r,"comment");
			$item2->uid = mysql_result($result3,$r,"uid");
			$item2->ts = mysql_result($result3,$r,"ts");
			array_push($links , $item2);
		}
	
	$itm = get_euro_itm($a);
	$links = array_merge($links , get_links($itm));
	
	

	$retval = new obj();
	$retval->sql = $s;
	$retval->status = 0;
	$retval->status_txt = "link added " . $action_comment;
	$retval->action_error = $action_error;
	$retval->links = $links;
	echo json_encode($retval);
	
	
}


?>
