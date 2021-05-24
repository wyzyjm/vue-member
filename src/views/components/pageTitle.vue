<template>
	<div class="pagetitle clearfix">
		<span class="title">{{ title }}</span>
		<span class="slot">
			<slot name="slot"></slot>
		</span>
	</div>
</template>
<script>
export default {
	data() {
		return {
			title: "",
		};
	},
	props: ["pagetitle"],
	mounted() {
		this.title = this.pagetitle;
	},
	methods: {},
	components: {},
};
</script>
<style scoped>
.pagetitle {
	line-height: 40px;
	height: 60px;
	padding-top: 20px;
	border-bottom: 1px solid #ddd;
	overflow: hidden;
}
.pagetitle .title {
	font-size: 18px;
}
.slot {
	float: right;
}
</style>

