<template>
<section class="row competences">
	<ul>
		<li class="category">
			<div class="group">
				<figure class="icon food"></figure>
				<p class="title">Ernährung</p>
			</div>
			<p class="description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.</p>
		</li>
		<li class="category">
			<div class="group">
				<figure class="icon kcal"></figure>
				<p class="title">Diät</p>
			</div>
			<p class="description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.</p>
		</li>
		<li class="category">
			<div class="group">
				<figure class="icon workout"></figure>
				<p class="title">Workout</p>
			</div>
			<p class="description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.</p>
		</li>
		<li class="category">
			<div class="group">
				<figure class="icon lifestyle"></figure>
				<p class="title">Lifestyle</p>
			</div>  
			<p class="description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.</p>
		</li>
		<li class="category">
			<div class="group"> 
				<figure class="icon bodybuilding"></figure>
				<p class="title">Bodybuilding</p>
			</div>
			<p class="description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.</p>
		</li>
		<li class="category">
			<div class="group">
				<figure class="icon stamina"></figure>
				<p class="title">Ausdauer</p>
			</div>
			<p class="description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.</p>
		</li>
	</ul>
</section>
</template>

<style lang="stylus">
@import '../styles/_vars.styl'

.competences
	padding: 2rem 0
	text-align: center
	ul
		list-style-type: none
		padding: 0px
		margin: 0px
	.category
		display: inline-flex
		flex-flow: column
		position: relative
		height: 100%
		width: 30%
		padding: .5rem
		margin: 1rem
		background-size: cover
		background-color: #fff
		text-align: left
		@media screen and ($low-scrn)
			width: 100%
			margin: 0
			margin-bottom: 1.5rem
			.group
				display: flex
				margin: 0 0 .5rem
		.icon
			width: 4rem
			height: 4rem
			background-size: cover
			background-repeat: no-repeat
			background-position: center
			@media screen and ($low-scrn)
				
				margin-right: 1rem
		.icon.food
			background-image: url(/public/food.svg)
			
		.icon.kcal
			background-image: url(/public/kcal.svg)
			
		.icon.workout
			background-image: url(/public/workout.svg)
			
		.icon.lifestyle
			background-image: url(/public/lifestyle.svg)
			
		.icon.bodybuilding
			background-image: url(/public/bodybuilding.svg)
			
		.icon.stamina
			background-image: url(/public/stamina.svg)
			
		.title
			font-size: 1.5rem
			letter-spacing: 3px
			margin-top: 1rem

		.description
			color: #455a64
			transition: color 50ms ease-in
		&:hover
			.description
				color: $primary-text
</style>

