<template>

	<el-container>
		<!-- 头部区域 -->
		<el-header>
			<div>
				<img src="../assets/logo.png" alt />
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logout">退出</el-button>
		</el-header>

		<!-- 页面主体 -->
		<el-container>
			<!-- 侧边栏 -->
			<el-aside :width="isCollapase ? '64px' : '200px'">
				<div class="toggle-button" @click="toggleClick">|||</div>
				<el-menu router unique-opened background-color="#333744"
					text-color="#fff" active-text-color="#409FFF"
					:collapse="isCollapase" :collapse-transition="false">
					<el-submenu :index="'/' + item.path" v-for="item in menuList" :key="item.id">
						<template slot="title">
							<i :class="iconList[item.id]"></i>
							<span>{{item.authName}}</span>
						</template>

						<el-menu-item :index="'/' + item.path" v-for="subItem in item.children" :key="subItem.id">

							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{subItem.authName}}</span>
							</template>

						</el-menu-item>
					</el-submenu>

				</el-menu>

			</el-aside>
			<!-- 主体部分 -->
			<el-main>
				<router-view></router-view>
			</el-main>

		</el-container>
	</el-container>

</template>

<script>
	export default {
		name: 'Home',
		data() {
			return {
				menuList: [],
				iconList: {
					'125': 'iconfont icon-user',
					'103': 'iconfont icon-tijikongjian',
					'101': 'iconfont icon-shangpin',
					'102': 'iconfont icon-danju',
					'145': 'iconfont icon-baobiao'
				},
				isCollapase: false
			}
		},
		created() {
			this.getMenuList()
		},

		methods: {
			logout() {
				window.sessionStorage.clear()
				this.$router.push("/login")

			},
			async getMenuList() {
				const {
					data: res
				} = await this.$http.get('menus')
				console.log(res);
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.menuList = res.data
			},
			toggleClick() {
				this.isCollapase = !this.isCollapase
			}
		}
	}
</script>

<style scoped>
	.el-header {
		background-color: #373f41;
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		align-items: center;
		color: #fff;
		font-size: 20px;
	}

	.el-header div {
		display: flex;
		align-items: center;
	}

	.el-header div img {
		height: 40px;
	}

	.el-header div span {
		margin-left: 15px;
	}

	.el-aside {
		background-color: #333744;
	}

	.el-menu {
		border: none;

	}

	.el-main {
		background-color: #eaedf1;
	}

	.iconfont {
		margin-right: 10px;
	}

	.toggle-button {
		background-color: #4A5064;
		font-size: 10px;
		line-height: 24px;
		color: #fff;
		text-align: center;
		letter-spacing: 0.2em;
		cursor: pointer;
	}

	.el-container .el-container {
		height: calc(100vh - 60px);
	}
</style>
