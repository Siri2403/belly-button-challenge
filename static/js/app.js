// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let metadata = data.metadata;
    let result = metadata.find(meta => meta.id == sample);

    let panel = d3.select("#sample-metadata");
    panel.html("");  // Clear any existing metadata

    Object.entries(result).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let samples = data.samples;
    let result = samples.find(sampleObj => sampleObj.id == sample);

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;  // Corrected typo
    let sample_values = result.sample_values;

    // Bubble Chart
    let bubbletrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    let bubblelayout = {
      title: 'Bacteria Cultures Per Sample',
      height: 600,
      width: 1200
    };

    Plotly.newPlot('bubble', [bubbletrace], bubblelayout);

    // Bar Chart
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

    let bartrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    let barlayout = {
      title: 'Top 10 Bacteria Cultures Found'
    };

    Plotly.newPlot('bar', [bartrace], barlayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let names = data.names;
    let dropdown = d3.select("#selDataset");

    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });

    let firstSample = names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
