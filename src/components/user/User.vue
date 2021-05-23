<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>

			<!-- 搜索与添加区域 -->
			<el-row :gutter="20">
				<el-col :span="9">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>

				</el-col>
			</el-row>

			<!-- 用户列表区域 -->
			<el-table :data="userList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="电话" prop="mobile"></el-table-column>
				<el-table-column label="角色" prop="role_name"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<!-- 按钮区域 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
						</el-button>

						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)">
						</el-button>
						<el-tooltip class="item" effect="dark" content="角色分配" :enterable="false" placement="top">
							<el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10, 15]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>

		<!-- 添加用户的对话框 -->

		<el-dialog title="添加用户" :visible.sync="addDialogVisible " width="50%" @close="addDialogClose">
			<el-form :model="addUserForm" ref="addUserFormRef" :rules="addUserFormRules" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addUserForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addUserForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addUserForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="addUserForm.mobile"></el-input>
				</el-form-item>
			</el-form>


			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 修改用户的对话框 -->
		<el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
			<!-- 内容主体 -->
			<el-form :model="editUserForm" ref="editUserFormRef" :rules="editUserFormRules" label-width="70px">
				<el-form-item label="用户名">
					<el-input v-model="editUserForm.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editUserForm.email"></el-input>
				</el-form-item>`
				<el-input v-model="editUserForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUser">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: 'User',
		data() {
			const checkEmail = (rule, value, callback) => {
				const regEmail = /^\w+@\w+(\.\w+)+$/
				if (regEmail.test(value)) {
					// 合法邮箱
					return callback()
				}
				callback(new Error('请输入合法邮箱'))
			}
			// 自定义手机号规则
			const checkMobile = (rule, value, callback) => {
				const regMobile = /^1[34578]\d{9}$/
				if (regMobile.test(value)) {
					return callback()
				}
				// 返回一个错误提示
				callback(new Error('请输入合法的手机号码'))
			}
			return {
				queryInfo: {
					pagenum: 1,
					query: '',
					pagesize: 10,
				},
				userList: [],
				total: 0,
				addDialogVisible: false,
				//添加表单验证用户的数据
				addUserForm: {
					username: '',
					password: '',
					email: '',
					moblie: ''
				},
				//添加表单验证用户规则
				addUserFormRules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '用户名的长度在3~10个字符之间',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '用户名的长度在6~15个字符之间',
							trigger: 'blur'
						}
					],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: checkEmail,
						trigger: 'blur'
					}],
					mobile: [{
						required: true,
						message: '请输入手机号码',
						trigger: 'blur'
					}, {
						validator: checkMobile,
						trigger: 'blur'
					}]
				},
				editDialogVisible: false,
				editUserForm: {},
				// 编辑用户表单验证
				editUserFormRules: {
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入手机号码',
							trigger: 'blur'
						},
						{
							validator: checkMobile,
							trigger: 'blur'
						}
					]
				},
			}
		},
		created() {
			this.getUserList()
		},
		methods: {
			async getUserList() {
				const {
					data: res
				} = await this.$http.get('users', {
					params: this.queryInfo
				})
				if (res.meta.status !== 200)
					return this.$message.error('获取用户列表失败')
				this.userList = res.data.users
				this.total = res.data.total
			},
			handleSizeChange(newSize) {
				// console.log(newSize)
				this.queryInfo.pagesize = newSize
				this.getUserList()
			},
			// 监听 页码值 改变事件
			handleCurrentChange(newSize) {
				// console.log(newSize)
				this.queryInfo.pagenum = newSize
				this.getUserList()
			},
			//监听 添加用户的事件
			addDialogClose() {
				this.$refs.addUserFormRef.resetFields()
			},
			//确定按钮，表单预校验
			addUser() {
				this.$refs.addUserFormRef.validate(async valiad => {
					if (!valiad) return
					//可以发起添加用户的网络请求
					const {
						data: res
					} = await this.$http.post('users', this.addUserForm)
					if (res.meta.status !== 201) {
						this.$message.error('添加用户失败！')
					}
					this.$message.success('添加用户成功！')
					//隐藏添加用户的对话框
					this.addDialogVisible = false
					//重新获取用户列表
					this.getUserList()
				})
			},
			// 编辑用户信息
			async showEditDialog(id) {
				const {
					data: res
				} = await this.$http.get('users/' + id)
				if (res.meta.status !== 200) {
					return this.$message.error('查询用户信息失败！')
				}
				this.editUserForm = res.data
				this.editDialogVisible = true
			},
			// 监听修改用户对话框的关闭事件
			editDialogClosed() {
				this.$refs.editUserFormRef.resetFields()
			},
			// 修改用户信息
			editUser() {
				// 提交请求前，表单预验证
				this.$refs.editUserFormRef.validate(async valid => {
					// console.log(valid)
					// 表单预校验失败
					if (!valid) return
					const {
						data: res
					} = await this.$http.put(
						'users/' + this.editUserForm.id, {
							email: this.editUserForm.email,
							mobile: this.editUserForm.mobile
						}
					)
					if (res.meta.status !== 200) {
						this.$message.error('更新用户信息失败！')
					}
					// 隐藏添加用户对话框
					this.editDialogVisible = false
					this.$message.success('更新用户信息成功！')
					this.getUserList()
				})
			},

			//删除用户
			async deleteUser(id) {
				const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				// 点击确定 返回值为：confirm
				// 点击取消 返回值为： cancel
				if (confirmResult !== 'confirm') {
					return this.$message.info('已取消删除')
				}
				const {
					data: res
				} = await this.$http.delete('users/' + id)
				if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
				this.$message.success('删除用户成功！')
				this.getUserList()
			},
		}
	}
</script>

<style>
</style>
