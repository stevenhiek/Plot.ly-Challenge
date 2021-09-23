const path = "Resources/samples.json"

function init() {
  var selector = d3.select("#selDataset");
  
  d3.json(path).then(function(data) {
    var sample_names = data.names;
    sample_names.forEach(function(sample) {
      selector.append("option").text(sample).property("value", sample);
    });

    const starting_sample = sample_names[0];
    create_charts(starting_sample);
    create_metadata(starting_sample);
  });
  }

function create_charts(sample) {
  d3.json(path).then(function(data) {
      var samples = data.samples;
      var samples_filtered = samples.filter(function(object){
          return(object.id == sample)
      });
      
      var array = samples_filtered[0]
      var otu_ids = array.otu_ids;
      var sample_values = array.sample_values;
      var otu_labels = array.otu_labels;
      var otu_ids_bar = otu_ids.slice(0, 10).map(function(otu_id) {
            return(`OTU ${otu_id}`)}).reverse()
      var otu_values_bar = sample_values.slice(0,10).reverse()
      var otu_labels_bar = otu_labels.slice(0,10).reverse()

      var data_bar =[
        {
            y: otu_ids_bar,
            x: otu_values_bar,
            text: otu_labels_bar,
            type:"bar",
            orientation:"h"
          }
        ];
        var layout_bar = {
          height: 600,
          width: 800
        };
        
        Plotly.newPlot("bar", data_bar, layout_bar);
        
        var data_bubble = [ 
          {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            type: "bubble",
            marker: {
              color: otu_ids,
              size: sample_values,
            }
          }
        ];
        var layout_bubble = {
          xaxis: { title: "OTU ID" }
        };
        
        Plotly.newPlot("bubble", data_bubble, layout_bubble);
        
      });
    }
    
function create_metadata(sample) {
  d3.json(path).then(function(data) {
    var metadata= data.metadata;
    var samples_array = metadata.filter(function(object){
      return(object.id == sample)});
      var array= samples_array[0];
      var metadata_panel = d3.select("#sample-metadata");
      metadata_panel.html("");
      Object.entries(array).forEach(function([key, value]) {
        metadata_panel.append("p").text(`${key}: ${value}`);
      });
    });
  }

function optionChanged(new_sample) {
  create_charts(new_sample);
  create_metadata(new_sample);
}

init();