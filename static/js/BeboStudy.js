// d3.json to pull in samples
function BuildData(sample) {
	d3.json("samples.json").then((data) => {
		console.log(data);
		var metadata = data.metadata;
		console.log(metadata);

		var metaray = metadata.filter(participant => participant.id == sample);
		console.log(metaray);

		var result = metaray[0];
		console.log(result);

		var panel = d3.select("#sample-metadata");

		panel.html("");

		Object.entries(result).forEach(([key, value]) => {
			panel.append("h5").text(`${key.toUpperCase()}: ${value}`);
		});

		var washFreq = result.wfreq;

		var gaugeData = [{
			domain: { x: [0, 1], y: [0, 1] },
			value: washFreq,
			title: { text: "Belly Button Wash Frequency <br> Scrubs / Week" },
			type: "indicator",
			mode: "gauge+number",
			delta: { reference: 400 },
			gauge: { axis: { range: [null, 9] } }
			}];
		      
		      var gaugeLayout = { width: 600, height: 400 };

		      Plotly.newPlot("gauge", gaugeData, gaugeLayout);		
	});
};

function BuildCharts (sample) {
	d3.json("samples.json").then((data) => {
		var samples = data.samples;
		
		var metaray = samples.filter(participant => participant.id == sample);
		console.log(metaray);	

		var result = metaray[0];

		var sample_values = result.sample_values;
		var otu_ids = result.otu_ids;
		var otu_labels = result.otu_labels;
		
		var ylabels = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`)	
		
		// bar chart
		var barData = [{
			x: sample_values.slice(0, 10).reverse(),
			y: ylabels.reverse(),
			text: otu_labels.slice(0,10).reverse(),
			type: "bar",
			orientation: "h",
		}];
		
		var barLayout = {
			title: "Top 10 Bacteria Cultures Found",
			margin: {
				t: 30,
				r: 30,
				b: 30,
				l: 150,
			}
		};



		Plotly.newPlot("bar", barData, barLayout)
		
		// bubbles
		var bubbleData = [{
			x: otu_ids,
			y: sample_values,
			text: otu_labels,
			mode: "markers",
			marker: {
				size: sample_values,
				color: otu_ids,
				colorscale: "Earth",
			}
		}];

		var bubbleLayout = {
			title:"Bacteria Cultures per Sample",
			margin: {
				t: 30,
				r: 30,
				b: 30,
				l: 30,
			},
			hovermode: "closest",
		};

		Plotly.newPlot("bubble", bubbleData, bubbleLayout)
	});
};



function init() {
	BuildData(940);
	BuildCharts(940);

	var Menu = d3.select("#selDataset");

	d3.json("samples.json").then((data) => {
		var names = data.names;
		names.forEach((sample) => {
			Menu
				.append("option")
				.property("value", sample)
				.text(sample);
		});

	});

}

function optionChanged(chgParticipant) {
	BuildData(chgParticipant);
	BuildCharts(chgParticipant);
}

// initialize page
init();