function getCities() {
	var dropdown = document.getElementById('locationSelect');
	var defaultOption = document.createElement('option');
	defaultOption.text = 'Choose Location';
	dropdown.add(defaultOption);
	dropdown.selectedIndex = 0;

	var allCities = JSON.parse(localities);
	for (var i = 0; i < allCities.length; i++) {
		var option = document.createElement('option');
		option.text = allCities[i].label;
		option.value = allCities[i].value;
		dropdown.add(option);
	}
}