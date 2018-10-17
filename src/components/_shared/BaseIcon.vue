<template>
	<svg
			class="icon"
			:class="{
				[`${classes}`]: classes,
				[`icon-${iconName}`]: iconName,
			}"
			:width="width"
			:height="height">
		<use  v-bind="{'xlink:href': symbols}"></use>
	</svg>
</template>

<script>
	export default {
		name: "BaseIcon",
		props: {
			classes: {
				type: String,
				default: ''
			},
			iconName: {
				type: String,
				default: ''
			},
			width: {
				type: [Number, String],
				default: 32
			},
			height: {
				type: [Number, String],
				default: 32
			},
		},
		computed: {
			symbols() {
				return "../svg-symbols.svg#" + this.iconName;
			},
		},
	}
</script>

<style scoped>
	.icon {
		display: inline-block;
		vertical-align: middle;
		fill: currentColor;
	}

</style>