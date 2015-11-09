/*

brain3d.js
Last updated 20151109 [CRM]

Originally based on qcsurf.js by Roberto Toro
https://github.com/r03ert0/qcsurf

Modified by Christopher Madan
Main changes from qcsurf:
- Stripped out the database related stuff
- Made more generic, not updateable/editable

*/

var debug=0;
var indexSelected=0;

var W;
var H;
var container;
var overlay;
var camera, scene, renderer, trackball;
var mesh;
var pop_stats;

function configure_subjects() {

	// Add table header
	$("#subjects table").append([
		"<tr>",
		"	<th>#</th>",
		"	<th>SubjectID</th>",
		"	<th>"+label_vals[0].val1+"</th>",
		"	<th>"+label_vals[0].val2+"</th>",
		"</tr>"
	].join("\n"));

	// Add subjects to subject table
	var i;
	for(i=0;i<sub.length;i++) {
		$("#subjects table").append([
			"<tr>",
			"	<td>"+(i+1)+"</td>",
			"	<td>"+sub[i].id+"</td>",
			"	<td>"+sub[i].val1+"</td>",
			"	<td>"+sub[i].val2+"</td>",
			"</tr>"
		].join("\n"));
	}
		
	// Update brain display on row selection
	$("tr").click(function() {
		var i=parseInt($($(this).find("td")[0]).text())-1;
		indexSelected=i;
		$("tr").removeClass('selected');
		$($("tr")[indexSelected+1]).addClass('selected');			
		try {
			loadMesh();
		} catch(ex) {
			$($($("tr")[indexSelected+1]).find("td")[2]).text("0");
			$($($("tr")[indexSelected+1]).find("td")[3]).text("NO DATA");
		}
	});
	$($("tr")[indexSelected+1]).addClass('selected');
	
	// Load subject population stats
	$.getJSON("fs/population_mean_sd.json",function(data) {
		pop_stats=data;
		console.log(pop_stats);
	});
}
function init_gui() {	
	// Listen to keyboard events
	$(window).keydown(function(e)
	{
		if(e.which==38) {
			indexSelected-=1;
			if(indexSelected<0)
				indexSelected=sub.length-1;
			$($("tr")[indexSelected+1]).click();
			$($("tr")[indexSelected+1]).focus();
			e.preventDefault();
		} else if(e.which==40) {
			indexSelected+=1;
			if(indexSelected>=sub.length)
				indexSelected=0;
			$($("tr")[indexSelected+1]).click();
			$($("tr")[indexSelected+1]).focus();
			e.preventDefault();
		}		
		return true;
	});
	// Connect button functions
	$("#left").click(selectHemisphere);
	$("#right").click(selectHemisphere);
	$("#pial").click(selectSurface);
	$("#white").click(selectSurface);		
	$("#save").click(function(){
		interactSave().then(function() {
			$("#save").text("Successfully saved");
			setTimeout(function(){$("#save").text("Save")},1000);
		});
	});
}
function init_3d() {

	overlay = document.getElementById('overlay');
	container = document.getElementById('container');

	W = $("#container").width();
	H = $("#container").height();

	camera = new THREE.PerspectiveCamera( 50, W / H, 1, 2000 );
	camera.position.z = 200;
	scene = new THREE.Scene();

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( W, H );
	renderer.domElement.style.position = "relative";
	container.appendChild( renderer.domElement );
	trackball = new THREE.TrackballControls(camera,renderer.domElement);

	// EVENTS
	window.addEventListener( 'resize', onWindowResize, false );
}
function selectHemisphere() {
	$("#hemisphere .button").removeClass("selected");
	$(this).addClass("selected");
	loadMesh();
}
function selectSurface() {
	$("#surface .button").removeClass("selected");
	$(this).addClass("selected");
	loadMesh();
}
function loadMesh() {
	var loader = new THREE.CTMLoader();
	var hemisphere=($("#hemisphere .selected").attr('id')=="left")?"lh":"rh";
	var surface=($("#surface .selected").attr('id')=="pial")?"pial":"white";
	$("#overlay").html("Loading...");
	loader.load( "fs/"+sub[indexSelected].id+"/surf/"+hemisphere+"."+surface+".ctm",   
		function( geometry ) {
			var material=new THREE.MeshNormalMaterial();
			mesh = new THREE.Mesh( geometry, material );
			while(scene.children.length>0)
				scene.remove(scene.children[0]);
			scene.add( mesh );
			$("#overlay").html(
				"<b>"+sub[indexSelected].id+"<br/>"+
				((hemisphere=="lh")?"Left Hemisphere":"Right Hemisphere")+"<br/>"+
				((surface=="pial")?"Pial Surface":"White Matter Surface")+"<br/></b>"
			);
			loadStats();
		},
		{useWorker: true,callbackProgress:function(obj){
			var pct=parseInt(100*obj.loaded/obj.total);
			if(pct<100)
				$("#overlay").html(pct+"%");
			else
				$("#overlay").html("Decompressing...");
		}}
	);
}
function loadStats() {
	var hemisphere=($("#hemisphere .selected").attr('id')=="left")?"lh":"rh";
	$.ajax({
		type: "GET",
		url:  "fs/"+sub[indexSelected].id+"/stats/"+hemisphere+".aparc.stats",
		mimeType: 'text/plain; charset=x-user-defined',
		dataType: "text",
		success: function(stats) {
			var lines=stats.split("\n");
			var commn={};
			var tsurf={};
			var thick={};
			var i;

			$("#overlay").append("<br />");
			commn["Total Vertices"]=parseInt(lines[18].split(",")[3]);
			commn["Total Surface Area"]=parseFloat(lines[19].split(",")[3]);
			commn["Mean Cortical Thickness"]=parseFloat(lines[20].split(",")[3]);
			for(i in commn)
				$("#overlay").append(i+": "+commn[i]+"<br/>");

			for(i=53;i<86;i++) {
				tsurf[lines[i].split(/[ ]+/)[0]]=parseFloat(lines[i].split(/[ ]+/)[2]);
				thick[lines[i].split(/[ ]+/)[0]]=parseFloat(lines[i].split(/[ ]+/)[4]);
			}
			$("#overlay").append("<br/>Regional Surface Area:<br />");
			drawFingerprint({variable:"SurfArea",data:tsurf});
			$("#overlay").append("<br/>Regional Cortical Thickness:<br />");
			drawFingerprint({variable:"ThickAvg",data:thick});
		}
	});
}
function makeSVG(tag, attrs) {
    var el=document.createElementNS("http://www.w3.org/2000/svg",tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}
function drawFingerprint(param) {
	
	var svg,r,i,d,arr,n,max,val,x,y,path,f;
	
	arr=Object.keys(param.data);
	
	svg=makeSVG('svg',{viewBox:'0,0,110,110',width:200,height:200});
	$("#overlay").append(svg);

	// draw radar circles
	for(r=0;r<=50;r+=12.5)
		$(svg).append(makeSVG('circle',{stroke:(r%25==0)?'#ffffff':'rgba(255,255,255,0.5)','stroke-width':0.5,r:Math.max(r,0.5),cx:55,cy:55,fill:'none'}));

	// draw radar circles units
	var txt=makeSVG('text',{x:50+12.5,y:57,"font-size":8,fill:"#afafaf"});
	txt.innerHTML="-&sigma;&nbsp;&nbsp;&nbsp;&mu;&nbsp;&nbsp;&nbsp;+&sigma;";
	rect = txt.getBBox();console.log(rect);
	$(svg).append(makeSVG('rect',{x:50+12.5,y:51,width:40,height:8,fill:"rgba(0,0,0,0.5)"}));
	$(svg).append(txt);
	
	// draw fingerprint path
	d=[];
	i=0;
	n=arr.length;
	for(val in param.data) {
		// compute min/max from pop_stats: mean ± s.d.
		min=pop_stats[val][param.variable].m-2*pop_stats[val][param.variable].s;
		max=pop_stats[val][param.variable].m+2*pop_stats[val][param.variable].s;

		// compute subject value
		r=(param.data[val]-min)/(max-min);
		if(r>1) r=1;
		if(r<0) r=0;
		x=55+50*r*Math.cos(2*Math.PI*i/n);
		y=55+50*r*Math.sin(2*Math.PI*i/n);
		d.push( ((i==0)?"M":"L")+x+","+y);
		i++;
	}
	d.push("Z");
	path=makeSVG('path',{id:'path',stroke:'#ffffff','stroke-width':1,fill:'none'});
	path.setAttributeNS(null,'d',d.join(" "));
	$(svg).append(path);

	// draw region dots
	i=0;
	for(val in param.data) {
		// compute min/max from pop_stats: mean ± s.d.
		min=pop_stats[val][param.variable].m-2*pop_stats[val][param.variable].s;
		max=pop_stats[val][param.variable].m+2*pop_stats[val][param.variable].s;

		// compute subject value
		r=(param.data[val]-min)/(max-min);
		f='#ffffff';
		if(r>1){ r=1;f="#ff0000"};
		if(r<0){ r=0;f="#ff0000"};
		x=55+50*r*Math.cos(2*Math.PI*i/n);
		y=55+50*r*Math.sin(2*Math.PI*i/n);
		var reg=makeSVG('circle',{class:'region ',title:val,fill:f,r:2,cx:x,cy:y});
		$(svg).append(reg);
		i++;
	}
	$(".region").css({"pointer-events":"auto"});
	$(".region").hover(function(){
		var x=$(this).attr('cx');
		var y=$(this).attr('cy');
		var svg=$(this).closest("svg")[0];
		var m=svg.getScreenCTM();
		var p=svg.createSVGPoint();
		p.x=x;
		p.y=y;
		var pp=p.matrixTransform(m);
		$("#text").css({left:pp.x,top:pp.y});
		$("#text").text($(this).attr('title'));
	});
}
function onWindowResize( event ) {
	W = $("#container").width();
	H = $("#container").height();
	renderer.setSize( W, H );
	camera.aspect = W/H;
	camera.updateProjectionMatrix();
}	
function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
	renderer.render( scene, camera );
	trackball.update();
}