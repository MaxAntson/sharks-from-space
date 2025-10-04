#  Datasets Used

## GBIF

### scalloped_hammerhead.csv

- This is the raw presence data of the scalloped hammerhead shark downloaded from [GBIF](https://www.gbif.org/occurrence/download?taxon_key=2418789).
- Citation: GBIF.org (28 September 2025) GBIF Occurrence Download <https://doi.org/10.15468/dl.utdsha>

### background_data.csv

- This is the background dataset to create month-based probability maps for generating background data, to tackle locational sampling bias and have higher likelihood of generating a more reliable absence dataset rather than selecting random data points.
- It contains the entire `Elasmobranchii` subclass, which includes sharks, rays, and other related species. The logic being the following:
  - It helps tackle sampling bias by showcasing where people usually go to spot similar animals
  - It helps to define more likely true absence points -> places where people go often and spot similar animals, but never ever spot a scalloped hammerhead, are more likely to be absence rather than random data points
- Citation: GBIF.org (30 September 2025) GBIF Occurrence Download <https://doi.org/10.15468/dl.w28sja>

## Environmental

###  bio_oracle

- Reference dataset just used to create a raw data raster and remove land data points. Not used to define any variables as it is non-NASA.

### ne_10m_coastline

- Coastline map useful for viz.
- Downloaded from the [NaturalEarthData](https://www.naturalearthdata.com/downloads/10m-physical-vectors/) .

### nasa

- `dist2coast.txt` is taken from <https://oceancolor.gsfc.nasa.gov/resources/docs/distfromcoast/>, a NASA dataset mapping latitudes and longitudes to distance to the nearest coast

### meteomatics

All data here is generated from [Meteomatics](https://www.meteomatics.com/) using the Meteomatics API, which was [made available](https://www.youtube.com/watch?v=CB69kArFwTM&list=PL37Yhb2zout3om0CIvX2yt1gugPr0skZc&index=9) during the NASA Space Apps Challenge.

- `current_speed/` contains monthly generated datasets for the accessible area (lat -39 to 36, lon -180 to 180), at a 1 degree resolution, of ocean current speed. Downloaded from Meteomatics using the variable , for relevant months from 2015 to 2020. Using the API documentation from [here](https://www.meteomatics.com/en/api/available-parameters/marine-parameters/ocean-current/), taking the `ocean_current_speed:ms` variable.
  - Note that in the future it would be good to add `ocean_current_direction`, `ocean_current_u` and `ocean_current_v` - these were not added for the time being due to their limited overlap with the sharks dataset with months/years.
- `ocean_depth/` contains monthly generated datasets for the accessible area (lat -39 to 36, lon -180 to 180), at a 1 degree resolution, of bathymetry. Using the API documentation from [here](https://www.meteomatics.com/en/api/available-parameters/marine-parameters/bathymetry/).
- `sea_surface_temperature/` contains monthly generated datasets for the accessible area (lat -39 to 36, lon -180 to 180), at a 1 degree resolution, of sea surface temperature in celcius. Using the API documentation from [here](https://www.meteomatics.com/en/api/available-parameters/marine-parameters/water-temperature/).
- `today/` contains current speed, ocean depth and sea surface temperature for 3rd October 2025. Along with `nasa/dist2coast.txt` mentioned above, these were used to predict shark presence probability based on the current status of environmental variables.
