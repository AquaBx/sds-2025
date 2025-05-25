import { getLocalTimeZone, today } from '@internationalized/date';

export const config = $state({
	activities: [],
	itinerary: [],
	cities: [],
	tags: [],
	types: [],
	hasSearched: false,
	hasItinerate: false,
})

export const searchFormdata = $state({
	tags: [],
	maxPrice: 50,
	hoursRange: [0, 24],
	search: ""
});

const start = today(getLocalTimeZone());
const end = start.add({ days: 7 });

export const guideFormdata = $state({
	tags: [],
	type: [],
	dates: {
		start,
		end
	},
	destination: {
		id: '',
		name: ''
	},
	currency: 'EUR',
	disability: false
});

export const loadData = (data) => {

	config.types = data.types;
	config.cities = data.cities;
	config.tags = data.tags;

	guideFormdata.type = config.types.map((type) => {
		return { ...type, selected: false };
	})

	guideFormdata.tags = config.tags.map((tag) => {
		return { ...tag, selected: false };
	})

	searchFormdata.tags = config.tags.map((tag) => {
		return { ...tag, selected: false };
	})
}