<template>
	<div class="page">
		<!-- Default -->
		<section>
			<h3>Default select fields</h3>
			<p>Unstyled default select fields</p>

			<ui-select
			class="field small"
			title="Small Default Select Field"
			:options="options.cars"
			:selected="selected.default"
			@selectionChanged="onSelectionChangedDefault">
			</ui-select>

			<ui-select
			class="field"
			title="Default Select Field"
			:options="options.cars"
			:selected="selected.default"
			@selectionChanged="onSelectionChangedDefault">
			</ui-select>

			<ui-select
			class="field large"
			title="Large Default Select Field"
			:options="options.cars"
			:selected="selected.default"
			@selectionChanged="onSelectionChangedDefault">
			</ui-select>

			<div class="controls">
				<button @click="resetDefault">reset</button>
				<button @click="randomDefault">random</button>
			</div>
		</section>

		<!-- Custom -->
		<!-- <section>
			<h3>Custom select fields</h3>
			<p>Customized select fields</p>

			<styled-select
			class="field small"
			title="Small Custom Select Field"
			:options="options.cars"
			:selected="selected.custom"
			@selectionChanged="onSelectionChangedCustom">
			</styled-select>

			<styled-select
			class="field"
			title="Custom Select Field"
			:options="options.cars"
			:selected="selected.custom"
			@selectionChanged="onSelectionChangedCustom">
			</styled-select>

			<styled-select
			class="field large"
			title="Large Custom Select Field"
			:options="options.cars"
			:selected="selected.custom"
			@selectionChanged="onSelectionChangedCustom">
			</styled-select>

			<div class="controls">
				<button @click="resetCustom">reset</button>
				<button @click="randomCustom">random</button>
			</div>
		</section> -->

		<!-- Material -->
		<!-- <section>
			<h3>Material style</h3>
			<p>Google Material-styled select fields</p>

			<material-select
			class="field small"
			title="Small Material Select Field"
			:options="options.cars"
			:selected="selected.material"
			@selectionChanged="onSelectionChangedMaterial">
			</material-select>

			<material-select
			class="field"
			title="Material Select Field"
			:options="options.cars"
			:selected="selected.material"
			@selectionChanged="onSelectionChangedMaterial">
			</material-select>

			<material-select
			class="field large"
			title="Large Material Select Field"
			:options="options.cars"
			:selected="selected.material"
			@selectionChanged="onSelectionChangedMaterial">
			</material-select>

			<div class="controls">
				<button @click="resetMaterial">reset</button>
				<button @click="randomMaterial">random</button>
			</div>
		</section> -->

		<!-- Scrolled -->
		<!-- <section>
			<h3>Scrolled selects</h3>
			<p>Select fields with many options not fitting the screen</p>

			<styled-select
			class="field small"
			title="Small Scrolled Select Field"
			:options="options.actors"
			:selected="selected.scrolled"
			@selectionChanged="onSelectionChangedScrolled">
			</styled-select>

			<styled-select
			class="field"
			title="Scrolled Select Field"
			:options="options.actors"
			:selected="selected.scrolled"
			@selectionChanged="onSelectionChangedScrolled">
			</styled-select>

			<styled-select
			class="field large"
			title="Scrolled Select Field"
			:options="options.actors"
			:selected="selected.scrolled"
			@selectionChanged="onSelectionChangedScrolled"
			:appearance="{contextMenu: {screenSpaceMargin: 24}}">
			</styled-select>

			<div class="controls">
				<button @click="resetScrolled">reset</button>
				<button @click="randomScrolled">random</button>
			</div>
		</section> -->
	</div>
</template>

<script>
// import Select from '../components/Select.vue'
// import StyledSelect from '../components/styled/Select.vue'
// import MaterialSelect from '../components/material/Select.vue'

function random(set) {
	let allKeys = Object.keys(set)
	return allKeys[Math.floor(Math.random() * allKeys.length)]
}

let options = {
	cars: {
		au: 'Audi',
		vw: 'Volkswagen',
		mrb: 'Mercedes-Benz',
		bmw: 'BMW',
		pr: 'Porsche',
		op: 'Opel',
		smt: 'Smart',
	},
	carsShort: {
		au: 'au',
		vw: 'vw',
		mrb: 'mrb',
		bmw: 'bmw',
		pr: 'pr',
		op: 'op',
		smt: 'smt',
	},
	actors: {
		tom_cruise: 'Tom Cruise',
		oprah_winfrey: 'Oprah Winfrey',
		u2: 'U2',
		tiger_woods: 'Tiger Woods',
		steven_spielberg: 'Steven Spielberg',
		howard_stern: 'Howard Stern',
		fifthy_cent: '50 Cent',
		dan_brown: 'Dan Brown',
		bruce_springsteen: 'Bruce Springsteen',
		donald_trump: 'Donald Trump',
		muhammad_ali: 'Muhammad Ali',
		paul_mccartney: 'Paul McCartney',
		george_lucas: 'George Lucas',
		elton_john: 'Elton John',
		david_letterman: 'David Letterman',
		phil_mickelson: 'Phil Mickelson',
		brad_pitt: 'Brad Pitt',
		peter_jackson: 'Peter Jackson',
		phil_mcgraw: 'Phil McGraw',
		jay_leno: 'Jay Leno',
		celine_dion: 'Celine Dion',
		kobe_bryant: 'Kobe Bryant',
		michael_jordan: 'Michael Jordan',
		johnny_depp: 'Johnny Depp',
		jerry_seinfeld: 'Jerry Seinfeld',
		simon_cowell: 'Simon Cowell',
		michael_schumacher: 'Michael Schumacher',
		tom_hanks: 'Tom Hanks',
		rush_limbaugh: 'Rush Limbaugh',
		denzel_washington: 'Denzel Washington',
		jennifer_aniston: 'Jennifer Aniston',
		angelina_jolie: 'Angelina Jolie',
		the_olsen_twins: 'The Olsen Twins',
		nicole_kidman: 'Nicole Kidman',
		the_eagles: 'The Eagles',
		rod_stewart: 'Rod Stewart',
		shaquille_o_neal: 'Shaquille O\'Neal',
		jerry_bruckheimer: 'Jerry Bruckheimer',
		david_beckham: 'David Beckham',
		jessica_simpson: 'Jessica Simpson',
		andrew_lloyd_webber: 'Andrew Lloyd Webber',
		lebron_james: 'LeBron James',
		neil_diamond: 'Neil Diamond',
		alex_rodriguez: 'Alex Rodriguez',
		will_smith: 'Will Smith',
		dick_wolf: 'Dick Wolf',
		dave_matthews_band: 'Dave Matthews Band',
		tom_brady: 'Tom Brady',
		ronaldinho: 'Ronaldinho',
		jodie_foster: 'Jodie Foster',
		ray_romano: 'Ray Romano',
		paris_hilton: 'Paris Hilton',
		adam_sandler: 'Adam Sandler',
		derek_jeter: 'Derek Jeter',
		jennifer_lopez: 'Jennifer Lopez',
		rick_warren: 'Rick Warren',
		scarlett_johansson: 'Scarlett Johansson',
		katie_couric: 'Katie Couric',
		maria_sharapova: 'Maria Sharapova',
		valentino_rossi: 'Valentino Rossi'
	},
}

export default {

	data() {
		return {
			options: options,
			selected: {
				default: null,
				custom: null,
				material: null,
				scrolled: null
			}
		}
	},
	methods: {
		randomDefault() {
			this.selected.default = random(options.cars)
		},
		randomCustom() {
			this.selected.custom = random(options.cars)
		},
		randomMaterial() {
			this.selected.material = random(options.cars)
		},
		randomScrolled() {
			this.selected.scrolled = random(options.actors)
		},
		resetDefault() {
			this.selected.default = null
		},
		resetCustom() {
			this.selected.custom = null
		},
		resetMaterial() {
			this.selected.material = null
		},
		resetScrolled() {
			this.selected.scrolled = null
		},
		onSelectionChangedDefault(val) {
			this.selected.default = val
		},
		onSelectionChangedCustom(val) {
			this.selected.custom = val
		},
		onSelectionChangedMaterial(val) {
			this.selected.material = val
		},
		onSelectionChangedScrolled(val) {
			this.selected.scrolled = val
		},
	}
}
</script>

<style lang="stylus" scoped>
.page
	padding: 2rem
	box-sizing: border-box

section
	margin-bottom: 3rem
	border-bottom: 1px solid #EFEFEF
	&:last-child
		border: 0px
	h3
		color: #333
	p
		color: #666
		margin-bottom: 2rem
	.controls
		padding-top: 1rem
		padding-bottom: .5rem
		button
			color: #4FC3F7
			border: 0px
			cursor: pointer
			padding: .25rem
			margin-right: .5rem
			background-color: rgba(0,0,0,0)
			transition: color .3s
			&:hover
				color: #2962FF
			&:last-child
				margin-right: 0px

.field
	cursor: pointer
	margin-bottom: 1rem
	width: 12rem
	&.small
		width: 4rem
	&.large
		width: 100%
</style>
