<template>
	<span class="stepCon" v-if="this.stepData.length" >
		<el-steps
			:active="active"
			finish-status="finish"
			align-center
			class="cestep"
		>
			<el-step
				:class="{ hasIcon: hasIcon }"
				:icon="hasIcon ? 'el-icon-check' : ''"
				v-for="(item, index) in stepData"
				:key="index"
				:title="item.title"
				:description="item.description"
			></el-step>
		</el-steps>
	</span>
</template>

<script>
export default {
	data() {
		return {
			activeId: 0,
			stepData: [],
			style:''
		};
	},
	watch: {
		active(v, ov) {
			this.activeId = v || 0;
		},
		datalist(v, ov) {
			this.stepData = v || [];
		},
	},
	computed: {
		hasIcon() {
			return this.activeId >= this.stepData.length - 1;
		},
	},
	mounted() {
		this.activeId = this.active || 0;
		this.stepData = this.datalist || [];
	},
	name: "Cestep",
	props: ["active", "datalist"],
};
</script>
<style >
.stepCon {
	padding: 40px 0;
	display: block;
}
.cestep .is-horizontal .el-step__line {
	top: 14px;
}
.cestep .is-horizontal .is-wait .el-step__line,
.cestep .is-horizontal .is-process .el-step__line {
	height: 1px;
}
.cestep .el-step__icon {
	border: 1px solid;
	width: 30px;
	height: 30px;
}
.cestep .el-step__title,
.cestep .el-step__description {
	font-weight: normal;
	font-size: 14px;
}
.cestep .is-finish .el-step__icon,
.cestep .is-process .el-step__icon {
	background: #409eff;
	color: #fff;
}
.cestep .is-finish .el-step__line {
	background: #409eff;
}
.cestep .el-step__title.is-finish,
.cestep .el-step__description.is-finish {
	color: inherit;
}
.cestep .hasIcon .el-step__icon {
	border-radius: 50%;
}
.cestep .hasIcon .is-finish .el-step__icon,
.cestep .hasIcon .is-process .el-step__icon {
	background: #fff;
	color: #409eff;
}
</style>
