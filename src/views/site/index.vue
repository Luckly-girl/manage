<template>
  <div class="site">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      @submit.native.prevent
    >
      <el-form-item v-if="btnAuthority($route.path, 0)">
        <bx-button
          class="searchBtn"
          type="text"
          @click="handlerAdd(false)"
          label="添加网站"
        ></bx-button>
      </el-form-item>
      <el-form-item label="域名" prop="realmName">
        <input
          maxlength="27"
          class="input"
          v-model="searchMap.realmName"
          placeholder="请输入域名"
        />
      </el-form-item>
      <el-form-item label="产品" prop="productName">
        <input
          maxlength="27"
          class="input"
          v-model="searchMap.productName"
          placeholder="请输入产品名称"
        />
      </el-form-item>
      <el-form-item>
        <bx-button
          class="searchBtn"
          type="text"
          @click="searchData()"
          label="搜索"
        ></bx-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="list"
      class="mt-18 site-table"
      v-loading="tableLoading"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      :row-class-name="tableRowClassName"
      @cell-mouse-enter="mouseEnter"
      @cell-mouse-leave="mouseLeave"
      @filter-change="statusFilter"
    >
      <el-table-column label="状态" align="center" min-width="60">
        <template slot-scope="scope">
          <img
            src="../../assets/images/blue.png"
            alt
            v-if="scope.row.serverStatus === 1"
          />
          <el-popover
            style="cursor: pointer;"
            placement="right"
            title
            width="300"
            trigger="hover"
            v-else
          >
            <el-table :data="scope.row.servers" :show-header="false">
              <el-table-column width="300" label>
                <template slot-scope="sco">
                  <span
                    >从{{ sco.row.nodeIp }} 到
                    {{ sco.row.serverIp }} 无法连接</span
                  >
                </template>
              </el-table-column>
            </el-table>
            <img src="../../assets/images/red.png" alt slot="reference" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        align="center"
        min-width="150"
      ></el-table-column>
      <el-table-column label="域名" align="center" min-width="250">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            title
            width="200"
            trigger="hover"
            :content="scope.row.realmName"
          >
            <div style="width: 100%" slot="reference">
              <span class="ellipsis-span">{{ scope.row.realmName }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="applyStatus"
        :label="sslStatusText"
        align="center"
        min-width="140"
        :filters="sslStatusList"
        column-key="sslStatus"
        :filter-multiple="false"
        :filter-method="filterTag"
      >
        <template slot-scope="scope">
          <div
            class="pointer"
            @click="
              handleApplyCertificate(
                scope.row.applyStatus,
                scope.row.id,
                scope.row.productId,
                scope.row.pemType
              )
            "
          >
            <div v-if="scope.row.applyStatus == '2'">
              <span style="color:#15b64e; padding-bottom:3px;"
                >申请成功（{{
                  scope.row.pemType == 0 ? "自动" : "手动"
                }}）</span
              >
            </div>
            <div v-else-if="scope.row.applyStatus == '4'">
              <span
                style="color:#fa4c4c; border-bottom:1px solid #fa4c4c; padding-bottom:3px;"
                >申请失败</span
              >
            </div>
            <div v-else-if="scope.row.applyStatus == '3'">
              <span
                style="color:#ffae00; border-bottom:1px solid #ffae00; padding-bottom:3px;"
                >申请中</span
              >
            </div>
            <div v-else-if="scope.row.applyStatus == '1'">
              <span
                style="color:#ffae00; border-bottom:1px solid #ffae00; padding-bottom:3px;"
                >正在申请</span
              >
            </div>
            <div v-else>
              <span
                style="color:#999999; border-bottom:1px solid #999999; padding-bottom:3px;"
                >未申请</span
              >
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="parseStatus"
        :label="parseStatusText"
        align="center"
        min-width="125"
        :filters="parseStatusList"
        column-key="parseStatus"
        :filter-multiple="false"
        :filter-method="filterTag"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.parseStatus == '2'">
            <span style="color:#15b64e">解析成功</span>
          </div>
          <div
            v-else-if="scope.row.parseStatus == '3'||scope.row.parseStatus == '4'"
            class="act-img-btn"
            @click="parseTable(scope.row.id)"
          >
            <span style="color:#fa4c4c;padding: 0 3px 3px 0;border-bottom: 1px solid #fa4c4c;">解析失败</span>
            <i class="iconfont iconbutton_explain"></i>
          </div>
          <div v-else-if="scope.row.parseStatus == '1'">
            <span style="color:#ffae00">解析中</span>
          </div>
          <div v-else>
            <span style="color:#999999;">未解析</span>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        :label="nginxStateText"
        align="center"
        min-width="125"
        :filters="nginxStateList"
        column-key="nginxState"
        :filter-multiple="false"
        :filter-method="filterTag"
        :filtered-value="
          searchMap.nginxState == '' ? [] : [searchMap.nginxState]
        "
      >
        <template slot-scope="scope">
          <div v-if="scope.row.nginxState == '2'">
            <span style="color:#15b64e">部署成功</span>
          </div>
          <div
            v-else-if="scope.row.nginxState == '3'"
            class="act-img-btn"
            @click="deployTable(scope.row.id)"
          >
            <span
              style="color:#fa4c4c;padding: 0 3px 3px 0;border-bottom: 1px solid #fa4c4c;"
              >部署失败</span
            >
            <i class="iconfont iconbutton_explain"></i>
          </div>
          <div v-else-if="scope.row.nginxState == '1'">
            <span style="color:#ffae00">部署中</span>
          </div>
          <el-popover
            style="cursor: pointer;"
            placement="top"
            title
            width="150"
            v-else
            trigger="hover"
            content="当前节点上的配置并不是最新配置，请点击后重新部署"
          >
            <div slot="reference">
              <span
                @click="deployNginxFile(scope.row.id)"
                style="color:#999999;border-bottom: 1px solid #999;"
                >预部署</span
              >
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="DNS劫持"
        align="center"
        min-width="110"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-popover
            style="cursor: pointer;"
            v-if="scope.row.dnsKidnapCheck == 0"
            placement="top"
            title
            width="150"
            trigger="hover"
            content="请前往站点管理‘更多’中开启DNS劫持开关"
          >
            <div slot="reference">
              <span style="color:#999999;">未开启</span>
            </div>
          </el-popover>
          <div v-else>
            <span
              style="color:#4d71ee; border-bottom:1px solid #4d71ee;cursor: pointer;"
              v-if="scope.row.dnsKidnap > 0"
              @click="getSiteDnsKidnapData(scope.row.id)"
              >{{ scope.row.dnsKidnap }}</span
            >
            <span v-else style="color:#999999;">无</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="cname" align="center" min-width="160">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            title
            width="140"
            trigger="hover"
            :content="scope.row.allDomin"
          >
            <div style="width: 100%" slot="reference">
              <span class="ellipsis-span">{{ scope.row.allDomin }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label
        align="center"
        min-width="60"
        v-if="btnAuthority($route.path, 0)"
      >
        <template slot-scope="scope">
          <div
            class="dis-flex copy-cname"
            @click="handlerAdd(true, scope.row)"
            :style="{
              backgroundColor: theme.backgroundColor,
              color: theme.color,
            }"
          >
            复用
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="type" label="类型" align="center" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.type == '1' ? 'HTTP' : 'HTTPS' }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="portNum" label="端口号" align="center" min-width="80"></el-table-column> -->
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="流量统计" align="center" min-width="80">
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_trend act-img-btn"
            @click="trafficClick(scope.row.id)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column label="日志统计" align="center" min-width="80">
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_trend act-img-btn"
            @click="
              logStatisticsClick(
                scope.row.id,
                scope.row.realmName,
                scope.row.isFilebeat,
                scope.row.productId
              )
            "
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="130"
        fixed="right"
        v-if="btnAuthority($route.path, 1) || btnAuthority($route.path, 2)"
      >
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_edit act-img-btn"
            @click="handlerEdit(scope.row.id)"
            v-if="btnAuthority($route.path, 1)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row.id, scope.row.productId)"
            v-if="btnAuthority($route.path, 2)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total="total"></pagination>
    <traffic-drawer ref="nodeTraffic" :nginxId="id"></traffic-drawer>
    <!-- DNS劫持列表 -->
    <el-dialog
      :visible.sync="dialogVisibleDnsKidnapData"
      width="626px"
      :close-on-click-modal="false"
    >
      <div style="padding: 0px 40px 20px;">
        <el-table
          :data="dnsKidnapList"
          :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
          :header-row-style="{ height: '50px' }"
          :row-style="{ height: '45px' }"
          stripe
        >
          <el-table-column label="劫持域名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 部署失败 弹框重新部署-->
    <div class="add">
      <el-dialog
        :inline="true"
        center
        :visible.sync="dialogDeploy"
        width="1000px"
        :close-on-click-modal="false"
        @closed="resetDialogDeploy"
      >
        <el-menu :default-active="activeIndex1" mode="horizontal">
          <el-menu-item index="1">
            部署失败
            <!-- <bx-button
              v-if="deployStatusAll"
              type="primary"
              @click="updateNginxAllDeployStatus"
              label="一键部署"
            ></bx-button> -->
          </el-menu-item>
        </el-menu>
        <div class="deploy-msg">
          <el-table
            :data="deployList"
            :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
            :header-row-style="{ height: '60px' }"
            :row-style="{ height: '56px' }"
            stripe
          >
            <el-table-column
              prop="nodeName"
              label="节点名称"
              align="center"
              min-width="125"
            ></el-table-column>
            <el-table-column label="部署状态" align="center" min-width="600">
              <template slot-scope="scope">
                <el-steps
                  :active="scope.row.tableStep"
                  align-center
                  finish-status="success"
                >
                  <el-step
                    title="下发消息"
                    :class="[
                      scope.row.step == 1 && scope.row.state == 0
                        ? 'nginx-step'
                        : '',
                    ]"
                  ></el-step>
                  <el-step
                    title="部署"
                    :class="[
                      scope.row.step == 2 && scope.row.state == 0
                        ? 'nginx-step'
                        : '',
                    ]"
                  ></el-step>
                  <el-step
                    title="解析"
                    :class="[
                      scope.row.step == 3 && scope.row.state == 0
                        ? 'nginx-step'
                        : '',
                    ]"
                  ></el-step>
                  <el-step title="完成"></el-step>
                </el-steps>
                <!-- <el-steps :active="1" finish-status="success" simple>
                  <el-step title="下发消息"></el-step>
                  <el-step title="配置文件部署中"></el-step>
                  <el-step title="DNS开始解析"></el-step>
                  <el-step title="DNS解析中"></el-step>
                  <el-step title="部署完成"></el-step>
                </el-steps> -->
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" min-width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.step != 4 && scope.row.state == 0">{{
                  scope.row.errorMsg
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              min-width="100"
              fixed="right"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.state == 0">
                  <bx-button
                    v-if="scope.row.step == 1 || scope.row.step == 2"
                    type="primary"
                    @click="updateNginxDeployStatus(scope.row)"
                    label="重新部署"
                  ></bx-button>
                  <bx-button
                    v-if="scope.row.step == 3"
                    type="primary"
                    @click="updateNginxParseStatus(scope.row)"
                    label="重新解析"
                  ></bx-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- <el-dialog
        :inline="true"
        center
        :visible.sync="dialogParse"
        width="650px"
        :close-on-click-modal="false"
        @closed="resetDialogDeploy"
      >
        <el-menu :default-active="activeIndex1" mode="horizontal">
          <el-menu-item index="1">
            解析失败
            <bx-button
              v-if="parseStatusAll"
              type="primary"
              @click="updateNginxAllParseStatus"
              label="一键解析"
            ></bx-button>
          </el-menu-item>
        </el-menu>
        <div class="deploy-msg">
          <el-table
            :data="parseList"
            :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
            :header-row-style="{ height: '60px' }"
            :row-style="{ height: '56px' }"
            stripe
          >
            <el-table-column prop="nodeName" label="节点名称" align="center" min-width="125"></el-table-column>
            <el-table-column prop="productName" label="产品名称" align="center" min-width="125"></el-table-column>
            <el-table-column label="解析状态" align="center" min-width="80">
              <template slot-scope="scope">
                <div v-if="scope.row.parseStatus == '2'">
                  <span style="color:#15b64e">解析成功</span>
                </div>
                <div v-else-if="scope.row.parseStatus == '3'">
                  <span style="color:#fa4c4c;">解析失败</span>
                </div>
                <div v-else-if="scope.row.parseStatus == '1'">
                  <span style="color:#ffae00">解析中</span>
                </div>
                <div v-else-if="scope.row.parseStatus == '4'">
                  <span style="color:#ffae00">暂停解析</span>
                </div>
                <div v-else>
                  <span style="color:#999999;">未解析</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" min-width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.parseStatus==3">{{scope.row.errorMsg}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="100" fixed="right">
              <template slot-scope="scope">
                <bx-button
                  v-if="scope.row.reparse==1"
                  type="primary"
                  @click="updateNginxParseStatus(scope.row)"
                  label="重新解析"
                ></bx-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog> -->
    </div>

    <!-- 新增网站 对话框 -->
    <div class="add">
      <el-dialog
        :close-on-click-modal="false"
        :inline="true"
        :visible.sync="dialogAddVisible"
        width="650px"
        @closed="resetForm('addSiteForm')"
      >
        <el-menu :default-active="activeIndex1" mode="horizontal">
          <el-menu-item index="1">{{
            reuse ? "复用cname" : "增加网站"
          }}</el-menu-item>
        </el-menu>

        <div class="add-site">
          <el-form
            ref="addSiteForm"
            :rules="addRules"
            :model="addSiteForm"
            label-width="70px"
            label-position="left"
          >
            <el-form-item label="产品名称" prop="productId">
              <el-select
                v-model="addSiteForm.productId"
                filterable
                placeholder="请选择产品名称"
                :disabled="reuse"
              >
                <el-option
                  v-for="(item, key) of productArr"
                  :key="key + '1'"
                  :value="item.id"
                  :label="item.productName"
                  :disabled="item.type == 0"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="协议类型" prop="type">
              <el-select
                v-model="addSiteForm.type"
                placeholder="请选择协议类型"
              >
                <el-option
                  v-for="(item, key) of agreementList"
                  :key="key + '1'"
                  :value="item.code"
                  :label="item.agreement"
                ></el-option>
              </el-select>
            </el-form-item>

            <!--<el-row>
              <el-col :span="14">
                <el-form-item label="线路类型" prop="recordLine">
                  <el-select v-model="addSiteForm.recordLine" placeholder="请选择线路类型">
                    <el-option
                      v-for="(item,index) of recordLineList"
                      :key="index"
                      :value="index"
                      :label="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" v-if="reuse">
                <span class="font-tail2">注意：更改线路类型则cname相同站点路线类型会同步更改</span>
              </el-col>
            </el-row>-->

            <el-form-item label="域名" prop="realmName">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入域名，用（逗号、空格、换行）隔开"
                v-model="addSiteForm.realmName"
              ></el-input>
            </el-form-item>

            <el-row>
              <el-col :span="15">
                <el-form-item label="端口号" prop="portNum">
                  <el-input
                    v-model="addSiteForm.portNum"
                    placeholder="请填写端口号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <span class="font-tail">不填写会使用默认端口号</span>
              </el-col>
            </el-row>

            <div v-for="(item, index) in addSiteForm.ipTypes" :key="index">
              <div class="inner">
                <el-row>
                  <el-col :span="11">
                    <div class="iptype-out">
                      <el-dropdown
                        trigger="click"
                        @command="handleCommand"
                        class="el-dropdown-ip"
                      >
                        <span class="el-dropdown-link">
                          {{ siteTypeList[item.ipType] }}
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-for="(siteType, siteTypeIndex) in siteTypeList"
                            :key="siteTypeIndex"
                            :command="{
                              index: index,
                              oldVal: item.ipType,
                              newVal: siteTypeIndex,
                            }"
                            >{{ siteType }}</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>
                      <el-form-item
                        :prop="'ipTypes.' + index + '.ip'"
                        :rules="rules.ip"
                        class="iptype-choose"
                      >
                        <input class="input1" placeholder v-model="item.ip" />
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="IP类型" label-width="58px">
                      <el-select
                        class="input2 ip-select"
                        filterable
                        v-model="item.type"
                      >
                        <el-option
                          v-for="(item, key) of ipTypeList"
                          :key="key + '1'"
                          :value="item"
                          :label="item"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="add-ips-btn" label-width="40px">
                      <bx-button
                        v-if="index == 0"
                        class="yuming"
                        type="primary"
                        @click="addIP"
                        label="添加"
                      ></bx-button>
                      <el-button
                        v-else
                        class="yuming cancel"
                        @click="delIP(index)"
                        >删除</el-button
                      >
                      <el-switch
                        class="switchStyle"
                        v-model="item.ableStatus"
                        :active-color="theme.backgroundColor"
                        inactive-color="#999"
                        :active-value="1"
                        :inactive-value="0"
                        active-text="开启"
                        inactive-text="暂停"
                      ></el-switch>
                      <!-- <bx-button
                        v-show="item.ableStatus==0"
                        class="yuming"
                        type="primary"
                        @click="checkIPStatus(index)"
                        label="开启"
                      ></bx-button>
                      <el-button v-show="item.ableStatus==1" class="yuming cancel" @click="checkIPStatus(index)">暂停</el-button>-->
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div style="height: 16px;"></div>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="addSiteForm.remark"></el-input>
            </el-form-item>

            <div v-if="addSiteForm.type == 2">
              <el-form-item
                label="源IP私钥文本域"
                label-width="105px"
                prop="originPrivkey"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入内容"
                  v-model="addSiteForm.originPrivkey"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="源IP证书文本域"
                label-width="105px"
                prop="originFullchain"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model="addSiteForm.originFullchain"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button class="reset" @click="resetForm('addSiteForm')"
            >重置</el-button
          >
          <bx-button
            class="confirm"
            :loading="addLoading"
            type="primary"
            @click="submitAdd('addSiteForm')"
            label="提交"
          ></bx-button>
        </div>
      </el-dialog>
    </div>

    <!-- 编辑 对话框 -->
    <div class="edit">
      <el-dialog
        :visible.sync="dialogEditVisible"
        width="650px"
        @closed="init()"
        :close-on-click-modal="false"
      >
        <el-menu
          :inline="true"
          :default-active="activeIndex2"
          :active-text-color="theme.backgroundColor"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">修改站点信息</el-menu-item>
          <el-menu-item index="2" v-if="btnAuthority($route.path, 3)"
            >站点分配</el-menu-item
          >
        </el-menu>

        <el-tabs
          class="site-tab"
          type="card"
          v-model="activeTabName"
          v-if="activeIndex2 == '1'"
          @tab-click="handleTabClick"
        >
          <el-tab-pane label="基础" name="base">
            <!-- 修改网站 -->
            <div class="eidt-site">
              <el-form
                ref="base"
                :rules="rules"
                :model="base"
                label-width="72px"
                label-position="left"
              >
                <div class="normal">
                  <!-- 选择框 -->
                  <el-form-item label="产品名称" v-if="!redirect">
                    <el-select
                      v-model="base.productId"
                      placeholder="请选择产品名称"
                      :disabled="base.multiplexId != '' || base.prohibit"
                      filterable
                    >
                      <el-option
                        v-for="(item, index) of productArr"
                        :key="index"
                        :value="item.id"
                        :label="item.productName"
                        :disabled="item.type == 0"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="协议类型" v-if="!redirect">
                    <el-select v-model="base.type">
                      <el-option
                        v-for="(item, index) of agreementList"
                        :key="index"
                        :value="item.code"
                        :label="item.agreement"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <!--<el-row>
                    <el-col :span="14">
                      <el-form-item label="线路类型" prop="recordLine">
                        <el-select v-model="base.recordLine" placeholder="请选择线路类型">
                          <el-option
                            v-for="(item,index) of recordLineList"
                            :key="index"
                            :value="index"
                            :label="item"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <span class="font-tail2">注意：更改线路类型则cname相同站点路线类型会同步更改</span>
                    </el-col>
                  </el-row>-->

                  <div
                    v-for="(item, index) in base.realmName"
                    :key="index"
                    v-show="yumingShow(index)"
                  >
                    <div class="inner">
                      <el-row>
                        <el-col :span="14">
                          <el-form-item
                            label="域名"
                            :prop="'realmName.' + index"
                            :rules="rules.realmName"
                          >
                            <el-input
                              v-model="base.realmName[index]"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item label-width="10px">
                            <div class="add-del-ico">
                              <i
                                class="el-icon-circle-plus-outline"
                                v-if="index == 0"
                                @click="addHost('base')"
                              ></i>
                              <i
                                class="el-icon-delete"
                                v-if="base.realmName.length > 1"
                                @click="delHost(index, 'base')"
                              ></i>
                            </div>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item label-width="60px">
                            <bx-button
                              v-if="index == 0"
                              type="primary"
                              @click="yumingShowClick"
                              :label="yuminglabel"
                            ></bx-button>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <div style="height: 16px;"></div>

                  <el-row>
                    <el-col :span="15">
                      <el-form-item label="端口号" prop="portNum">
                        <el-input
                          v-model="base.portNum"
                          placeholder="请填写端口号"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <span class="font-tail">不填写会使用默认端口号</span>
                    </el-col>
                  </el-row>

                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="base.remark"></el-input>
                  </el-form-item>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item
                        label="重定向"
                        prop="redirect"
                        class="mb-20"
                      >
                        <el-switch
                          v-model="base.redirect"
                          @change="redirectSwich"
                          :inactive-value="0"
                          :active-value="1"
                          :active-color="theme.backgroundColor"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <span class="font-tail"
                        >注意：更改重定向则cname相同站点重定向会同步更改</span
                      >
                    </el-col>
                  </el-row>
                  <div class="redirect-group mb-20" v-show="redirect">
                    <el-radio-group v-model="base.redirectType">
                      <el-radio :label="1">301(永久重定向)</el-radio>
                      <el-radio :label="2">302(临时重定向)</el-radio>
                    </el-radio-group>
                  </div>
                  <el-row v-show="redirect">
                    <el-col :span="15">
                      <el-form-item label="重定向域名" prop="redirectUrl">
                        <el-input v-model="base.redirectUrl"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <span class="font-tail2">
                        示例：http://www.baidu.com
                        <br />（https://www.baidu.com）
                      </span>
                    </el-col>
                  </el-row>
                </div>

                <div class="reserve mb-10" v-if="!redirect">
                  <div v-for="(item, index) in base.ipTypes" :key="index">
                    <div class="inner">
                      <el-row>
                        <el-col :span="11">
                          <div class="iptype-out">
                            <el-dropdown
                              trigger="click"
                              @command="handleCommand"
                              class="el-dropdown-ip"
                            >
                              <span class="el-dropdown-link">
                                {{ siteTypeList[item.ipType] }}
                                <i
                                  class="el-icon-arrow-down el-icon--right"
                                ></i>
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                  v-for="(siteType,
                                  siteTypeIndex) in siteTypeList"
                                  :key="siteTypeIndex"
                                  :command="{
                                    index: index,
                                    oldVal: item.ipType,
                                    newVal: siteTypeIndex,
                                  }"
                                  >{{ siteType }}</el-dropdown-item
                                >
                              </el-dropdown-menu>
                            </el-dropdown>
                            <el-form-item
                              :prop="'ipTypes.' + index + '.ip'"
                              :rules="rules.ip"
                              class="iptype-choose"
                            >
                              <input
                                class="input1"
                                placeholder
                                v-model="item.ip"
                              />
                            </el-form-item>
                          </div>
                        </el-col>
                        <el-col :span="7">
                          <el-form-item label="类型" label-width="58px">
                            <el-select
                              class="input2 ip-select"
                              filterable
                              v-model="item.type"
                            >
                              <el-option
                                v-for="(item, index) of ipTypeList"
                                :key="index"
                                :value="item"
                                :label="item"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label-width="0px">
                            <div class="add-del-ico">
                              <i
                                class="el-icon-circle-plus-outline"
                                v-if="index == 0"
                                @click="addIPBase"
                              ></i>
                              <i
                                class="el-icon-delete"
                                v-if="base.ipTypes.length > 1"
                                @click="delIPBase(index)"
                              ></i>
                            </div>
                            <el-switch
                              class="switchStyle"
                              v-model="item.ableStatus"
                              :active-color="theme.backgroundColor"
                              :active-value="1"
                              :inactive-value="0"
                              active-text="开启"
                              inactive-text="暂停"
                            ></el-switch>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>

                <div class="reserve" v-if="!redirect">
                  <div v-for="(item, index) in base.localNames" :key="index">
                    <div class="inner">
                      <el-row>
                        <el-col :span="15">
                          <el-form-item
                            label="路径"
                            label-width="95px"
                            :prop="'localNames.' + index + '.localName'"
                            :rules="rules.localName"
                          >
                            <el-input v-model="item.localName"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-width="20px">
                            <div class="add-del-ico">
                              <i
                                class="el-icon-circle-plus-outline"
                                v-if="index == 0"
                                @click="addLocalBase"
                              ></i>
                              <i
                                class="el-icon-delete"
                                v-if="base.localNames.length > 1"
                                @click="delLocalBase(index)"
                              ></i>
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-form-item
                        label="反向代理IP"
                        label-width="95px"
                        :prop="'localNames.' + index + '.lips'"
                        :rules="rules.lips"
                      >
                        <el-input
                          v-model="item.lips"
                          placeholder="多个IP请用,隔开"
                        ></el-input>
                      </el-form-item>
                      <el-form-item
                        label="反向代理路径"
                        label-width="95px"
                        :prop="'localNames.' + index + '.localUrl'"
                        :rules="rules.localUrl"
                      >
                        <el-input v-model="item.localUrl"></el-input>
                      </el-form-item>

                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="长链接" label-width="95px">
                            <el-switch
                              :active-color="theme.backgroundColor"
                              v-if="item.longLink != undefined"
                              v-model="item.longLink"
                              :inactive-value="0"
                              :active-value="1"
                            ></el-switch>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="gzip状态" label-width="95px">
                            <el-switch
                              :active-color="theme.backgroundColor"
                              v-if="item.gzipStatus != undefined"
                              v-model="item.gzipStatus"
                              :inactive-value="0"
                              :active-value="1"
                            ></el-switch>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <div style="height: 16px;"></div>
                    </div>
                  </div>
                </div>

                <div class="normal" v-if="base.type == 2 && !redirect">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="源IP私钥文本域" prop="originPrivkey">
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4 }"
                          placeholder="请输入内容"
                          v-model="base.originPrivkey"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        label="源IP证书文本域"
                        prop="originFullchain"
                      >
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4 }"
                          v-model="base.originFullchain"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane label="安全" name="safe" v-if="!redirect">
            <el-form
              ref="safe"
              :model="safe"
              :rules="safeRules"
              label-width="100px"
              label-position="left"
            >
              <div class="normals">
                <el-row>
                  <el-col :span="16">
                    <el-form-item label="白名单" prop="whiteLists">
                      <el-input
                        v-model="safe.whiteLists"
                        placeholder="请输入白名单"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <span class="font-tail">多个IP请用 “,” 隔开</span>
                  </el-col>
                </el-row>

                <!-- 选择框 -->
                <el-form-item label="白名单安全组" prop="whiteGroups">
                  <el-select
                    v-model="safe.whiteGroups"
                    placeholder="请选择白名单安全组"
                    multiple
                    filterable
                    collapse-tags
                  >
                    <el-option
                      v-for="(item, index) of whiteGroupList"
                      :key="index"
                      :label="item.whiteGroupName"
                      :value="item.whiteGroupId"
                      :disabled="item.type == 0"
                    ></el-option>
                  </el-select>
                  <!--                  <el-button class="yuming" type="primary" @click="addWhite">确认</el-button>-->
                </el-form-item>

                <el-row>
                  <el-col :span="16">
                    <el-form-item label="黑名单" prop="blackLists">
                      <el-input
                        v-model="safe.blackLists"
                        placeholder="请输入黑名单"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <span class="font-tail">多个IP请用 “,” 隔开</span>
                  </el-col>
                </el-row>

                <!-- 选择框 -->
                <el-form-item label="黑名单安全组" prop="blackGroups">
                  <el-select
                    v-model="safe.blackGroups"
                    placeholder="请选择黑名单安全组"
                    multiple
                    filterable
                    collapse-tags
                  >
                    <el-option
                      v-for="(item, index) of blackGroupList"
                      :key="index"
                      :label="item.blackGroupName"
                      :value="item.blackGroupId"
                      :disabled="item.type == 0"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="日志分析黑名单"
                  prop="logAnalysis"
                  label-width="120px"
                >
                  <el-switch
                    :active-color="theme.backgroundColor"
                    :inactive-value="0"
                    :active-value="1"
                    v-model="safe.logAnalysis"
                    :disabled="safe.isFilebeat == 0"
                  ></el-switch>
                </el-form-item>
                <div v-show="safe.logAnalysis" class="_safe-log">
                  <el-row>
                    <el-col :span="15">
                      <el-form-item
                        label="封禁时间"
                        prop="banTime"
                        label-width="80px"
                      >
                        <el-input v-model="safe.banTime"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <span class="ban">小时</span>
                    </el-col>
                  </el-row>
                  <div class="ban-tip">
                    封禁时间请填写正整数，不填写默认封禁2小时
                  </div>

                  <el-row>
                    <el-col :span="15">
                      <el-form-item
                        label="封禁规则"
                        prop="banRole"
                        label-width="80px"
                      >
                        <el-input v-model="safe.banRole"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <span class="ban">次/分钟</span>
                    </el-col>
                  </el-row>
                  <div class="ban-tip">
                    封禁规则请填写正整数,不填默认20次/分钟
                    <br />例:填写10
                    则一分钟内同一ip访问超过10次则会加入日志黑名单
                  </div>
                </div>

                <div>
                  <el-form-item label="CC防护" prop="ccSwitch" class="_safe-cc">
                    <el-switch
                      :active-color="theme.backgroundColor"
                      :inactive-value="0"
                      :active-value="1"
                      v-model="safe.ccSwitch"
                      @change="safeCcSwitch"
                    ></el-switch>
                  </el-form-item>
                  <el-form-item
                    label="CC类型"
                    prop="ccType"
                    class="_safe-cc"
                    v-show="safe.ccSwitch"
                  >
                    <el-radio-group v-model="safe.ccType" @change="safeCcRadio">
                      <el-radio :label="1">等待进入</el-radio>
                      <el-radio :label="2">验证码</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div style="height: 16px"></div>
                </div>

                <!-- <div v-show="safe.ccType == 2">
                  <el-form-item label="访问频率" prop="ccDefense">
                    <el-input v-model="safe.ccDefense"></el-input>
                  </el-form-item>
                </div>-->
                <el-row>
                  <el-col :span="7">
                    <el-form-item label="防撞库" prop="antiProxyIp">
                      <el-switch
                        :active-color="theme.backgroundColor"
                        :inactive-value="0"
                        :active-value="1"
                        v-model="safe.antiProxyIp"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="17">
                    <span class="font-tail antiProxyIp-tail"
                      >注意：开启该功能之后，部分手机浏览器加速功能会导致站点不可访问，关闭手机加速功能后可访问</span
                    >
                  </el-col>
                </el-row>

                <div>
                  <el-form-item
                    label="waf防护"
                    prop="safeSwitch"
                    class="_safe-cc"
                  >
                    <el-switch
                      v-model="safe.safeSwitch"
                      @change="safeSwitchChange"
                      :active-color="theme.backgroundColor"
                      :inactive-value="0"
                      :active-value="1"
                    ></el-switch>
                  </el-form-item>
                  <el-form-item class="_safe-cc" v-show="safe.safeSwitch">
                    <el-checkbox-group
                      v-model="safe.safeValue"
                      style="display: flex; flex-direction: column;"
                    >
                      <el-checkbox
                        v-for="(item, index) in wafDefendList"
                        :key="index"
                        :label="item.label"
                      >
                        {{ item.name }}
                        <span class="font-tail" style="padding-left: 20px;">{{
                          item.desc
                        }}</span>
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <div style="height: 16px"></div>
                </div>
              </div>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="证书内容设置" name="ssl">
            <el-form
              ref="ssl"
              :rules="sslRules"
              :model="ssl"
              label-width="88px"
              label-position="left"
            >
              <div class="normals">
                <!-- 多行输入 -->
                <el-form-item label="私钥文本域" prop="privkey">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder
                    v-model="ssl.privkey"
                  ></el-input>
                </el-form-item>

                <el-form-item label="证书文本域" prop="fullchain">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder
                    v-model="ssl.fullchain"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="信息" name="contactMsg">
            <el-form
              ref="contactMsg"
              :rules="msgRules"
              :model="contactMsg"
              label-width="88px"
              label-position="left"
            >
              <div class="normals">
                <el-form-item label="手机号" prop="phoneNumber">
                  <el-input
                    v-model="contactMsg.phoneNumber"
                    placeholder="请输入手机号"
                    maxlength="11"
                  ></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qqNumber">
                  <el-input
                    v-model="contactMsg.qqNumber"
                    placeholder="请输入qq号"
                  ></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                  <el-input
                    v-model="contactMsg.email"
                    placeholder="请输入电子邮箱"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Skype" prop="skype">
                  <el-input
                    v-model="contactMsg.skype"
                    placeholder="请输入Skype"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="更多" name="more" v-if="!redirect">
            <el-form
              ref="more"
              :model="more"
              :rules="moreRules"
              label-width="140px"
              label-position="left"
              class="more"
            >
              <div class="normal inner">
                <el-form-item label="国家限制" prop="countrySafe">
                  <el-switch
                    :active-color="theme.backgroundColor"
                    v-model="more.countrySafe"
                    :inactive-value="0"
                    :active-value="1"
                    @change="countrySafeSwitch"
                  ></el-switch>
                </el-form-item>
              </div>

              <div class="reserve inner" v-show="more.countrySafe">
                <el-form-item label="是否使用收费版" prop="paidVersionFree">
                  <el-switch
                    :active-color="theme.backgroundColor"
                    v-model="more.paidVersionFree"
                    :inactive-value="0"
                    :active-value="1"
                  ></el-switch>
                </el-form-item>

                <el-form-item label="放行国家" prop="countrys">
                  <el-select
                    v-model="more.countrys"
                    placeholder="请选择放行国家"
                    filterable
                    multiple
                    collapse-tags
                  >
                    <el-option
                      v-for="(item, index) of countrysList"
                      :key="index"
                      :label="item.countryName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- 选择框 -->
                <el-form-item label="国家安全组" prop="countryGroup">
                  <el-select
                    v-model="more.countryGroups"
                    placeholder="请选择国家安全组"
                    multiple
                    filterable
                    collapse-tags
                  >
                    <el-option
                      v-for="(item, index) of countryGroupList"
                      :key="index"
                      :label="item.countryGroupName"
                      :value="item.countryGroupId"
                      :disabled="item.type == 0"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="normal inner">
                <el-form-item label="gzip开启状态" prop="gzip">
                  <el-switch
                    :active-color="theme.backgroundColor"
                    :inactive-value="0"
                    :active-value="1"
                    v-model="more.gzip"
                    @change="gzipSwitch"
                  ></el-switch>
                </el-form-item>
              </div>

              <div class="reserve inner" v-show="more.gzip">
                <el-form-item
                  label="gzip支持的压缩文本类型"
                  label-width="180px"
                  class="check"
                >
                  <el-checkbox-group v-model="more.gzipTypes">
                    <el-checkbox
                      v-for="(item, index) in gzipTypeList"
                      :label="item.label"
                      :key="index"
                      >{{ item.name }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
              </div>

              <div class="normal flex-space inner">
                <el-form-item label="缓存开启状态">
                  <el-switch
                    :active-color="theme.backgroundColor"
                    :inactive-value="$store.state.swichType[0]"
                    :active-value="$store.state.swichType[1]"
                    v-model="more.cache"
                    @change="cacheSwitch"
                  ></el-switch>
                </el-form-item>
                <bx-button
                  type="primary"
                  size="small"
                  @click="cleanCache"
                  v-show="more.cache"
                  label="清除缓存"
                ></bx-button>
              </div>

              <div class="reserve inner" v-show="more.cache">
                <el-form-item
                  label="需要缓存的文件类型"
                  label-width="200px"
                  class="check"
                >
                  <el-checkbox-group v-model="more.cacheTypes">
                    <el-checkbox
                      v-for="(item, index) in cacheTypeList"
                      :label="item.label"
                      :key="index"
                      >{{ item.name }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item
                  label="设置缓存时间"
                  label-width="100px"
                  class="check cache-time"
                  prop="cacheTime"
                >
                  <el-input
                    v-model="more.cacheTime"
                    style="width: 200px;"
                  ></el-input>
                  <el-radio-group v-model="more.timeType">
                    <el-radio
                      v-for="(item, index) in cacheTimeList"
                      :key="index"
                      :label="item.type"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <div class="ban-tip other-tip">
                  缓存时间请填写正整数,不填写默认缓存30天
                </div>
              </div>

              <div class="normal inner">
                <el-form-item label="limit访问限制状态" prop="limits">
                  <el-switch
                    :active-color="theme.backgroundColor"
                    :inactive-value="0"
                    :active-value="1"
                    v-model="more.limits"
                    @change="limitsSwitch"
                  ></el-switch>
                </el-form-item>
              </div>

              <div class="reserve inner20" v-show="more.limits">
                <el-row>
                  <el-col :span="18">
                    <el-form-item
                      label="单个IP最大连接数限制"
                      label-width="150px"
                      prop="ipNum"
                    >
                      <el-input placeholder v-model="more.ipNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" class="font-limit-bg">
                    <span class="font-limit unCopy"
                      >个/s (不填写默认10个/s)</span
                    >
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="18">
                    <el-form-item
                      label="网站的最大连接数限制"
                      label-width="150px"
                      prop="serverNum"
                    >
                      <el-input placeholder v-model="more.serverNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" class="font-limit-bg">
                    <span class="font-limit unCopy"
                      >个/s (不填写默认500个/s)</span
                    >
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="18" class="font-limit-bg">
                    <el-form-item
                      label="网站的最大下载速率"
                      label-width="150px"
                      prop="downloadRate"
                    >
                      <el-input
                        placeholder
                        v-model="more.downloadRate"
                        maxlength="10"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" class="font-limit-bg">
                    <span class="font-limit unCopy"
                      >k/s (不填写默认200k/s，最大2,000,000,000k/s)</span
                    >
                  </el-col>
                </el-row>
              </div>
              <div class="normal">
                <el-form-item label="HTTP强制跳转" prop="jumpHttps">
                  <el-switch
                    :active-color="theme.backgroundColor"
                    v-model="more.jumpHttps"
                    :inactive-value="0"
                    :active-value="1"
                    @change="jumpHttpsSwitch"
                    :disabled="more.applyStatus != 2"
                  ></el-switch>
                </el-form-item>
                <el-form-item label="取消HTTPS访问" prop="cancelHttps">
                  <el-switch
                    :active-color="theme.backgroundColor"
                    v-model="more.cancelHttps"
                    :inactive-value="0"
                    :active-value="1"
                    :disabled="more.jumpHttps == 0"
                  ></el-switch>
                </el-form-item>
                <el-form-item label="站点支持跨域" prop="siteCrossDomain">
                  <el-switch
                    :active-color="theme.backgroundColor"
                    v-model="more.siteCrossDomain"
                    :inactive-value="0"
                    :active-value="1"
                  ></el-switch>
                </el-form-item>
                <el-form-item
                  label="反向代理支持跨域"
                  prop="reverseProxyCrossDomain"
                >
                  <el-switch
                    :active-color="theme.backgroundColor"
                    v-model="more.reverseProxyCrossDomain"
                    :inactive-value="0"
                    :active-value="1"
                  ></el-switch>
                </el-form-item>
                <el-form-item label="DNS劫持测试" prop="dnsKidnapCheck">
                  <el-switch
                    :active-color="theme.backgroundColor"
                    v-model="more.dnsKidnapCheck"
                    :inactive-value="0"
                    :active-value="1"
                  ></el-switch>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="allocation" v-else>
          <div class="select">
            <span class="label">分配组织架构</span>
            <el-cascader
              v-model="pgNumCode"
              :options="options"
              clearable
              filterable
              collapse-tags
              @change="handleChange"
              :props="{
                multiple: true,
                expandTrigger: 'hover',
                label: 'name',
                children: 'child',
                value: 'numCode',
                checkStrictly: true,
              }"
            ></el-cascader>
          </div>
        </div>

        <div slot="footer" class="dialog-footer" v-if="activeIndex2 == '1'">
          <el-button class="reset" @click="resetForm(activeTabName, 'edit')"
            >取消</el-button
          >
          <bx-button
            class="confirm"
            type="primary"
            @click="submitEdit"
            label="保存"
            >保存</bx-button
          >
        </div>

        <div slot="footer" class="dialog-footer" v-else>
          <bx-button
            class="save"
            type="primary"
            @click="submitSave"
            label="保存"
          ></bx-button>
        </div>
      </el-dialog>
    </div>

    <!-- 日志统计对话框 -->
    <transition name="slide">
      <div class="log-statistics" v-if="logShow">
        <div class="header">
          <div class="header-left">
            <div class="time-select">
              <!-- 时间按钮 -->
              <ul>
                <li
                  v-for="(item, index) of btnList"
                  :key="index"
                  class="timeBtn unCopy"
                  :class="{ bgColor: index === mark ? true : false }"
                  @click="handlerTimeBtn(index, item.value)"
                >
                  {{ item.label }}
                </li>
              </ul>
              <span class="time-sel">选择时间范围：</span>
              <el-date-picker
                v-model="dateSearch"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>

            <div class="time-select">
              <span class="time-sel">选择域名：</span>
              <el-select
                v-model="realmName"
                multiple
                collapse-tags
                placeholder="不选默认查询所有"
                style="width: 280px"
              >
                <el-option
                  v-for="(item, index) in realmNameArr"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <img
                @click="searchTimeBtn"
                class="time-search"
                src="@/assets/images/cdn/button_search_2.png"
              />
            </div>
          </div>
          <div class="header-right">
            <i
              class="el-dialog__close el-icon el-icon-close"
              @click="goBack"
            ></i>
          </div>
        </div>
        <div class="log-content">
          <div class="row">
            <div class="three">
              <pv-and-uv-count
                ref="pvuv"
                class="charts"
                :dateSearch="dateSearch"
                :realmNameArr="realmNameArr"
                :id="id"
                :realmName="realmName"
              ></pv-and-uv-count>
            </div>
            <div class="three">
              <reptile-count
                ref="reptileCount"
                class="charts"
                :dateSearch="dateSearch"
                :realmNameArr="realmNameArr"
                :id="id"
                :realmName="realmName"
              ></reptile-count>
            </div>
          </div>
          <div class="row">
            <div class="two">
              <visit-count
                ref="visitCount"
                class="charts"
                :dateSearch="dateSearch"
                :realmNameArr="realmNameArr"
                :realmName="realmName"
              ></visit-count>
            </div>
            <div class="two">
              <visit-code
                ref="visitCode"
                class="charts"
                :dateSearch="dateSearch"
                :realmNameArr="realmNameArr"
                :realmName="realmName"
              ></visit-code>
            </div>
          </div>
          <div class="row">
            <div class="two">
              <average-response-time
                ref="art"
                class="charts"
                :dateSearch="dateSearch"
                :realmNameArr="realmNameArr"
                :realmName="realmName"
              ></average-response-time>
            </div>
            <div class="two">
              <url-path
                ref="urlPath"
                class="charts"
                :dateSearch="dateSearch"
                :realmNameArr="realmNameArr"
                :realmName="realmName"
              ></url-path>
            </div>
          </div>
          <div class="row">
            <div class="two">
              <flow-statistics
                ref="flow"
                class="charts"
                :dateSearch="dateSearch"
                :realmNameArr="realmNameArr"
                :realmName="realmName"
              ></flow-statistics>
            </div>
            <div class="two">
              <ip-top20
                ref="ipTop20"
                class="charts"
                :dateSearch="dateSearch"
                :realmNameArr="realmNameArr"
                :realmName="realmName"
              ></ip-top20>
            </div>
          </div>
          <el-radio-group
            v-model="radioView"
            style="margin: 20px 0;"
            :fill="theme.backgroundColor"
            @change="ipEchartChange"
          >
            <el-radio-button label="热力图"></el-radio-button>
            <el-radio-button label="柱形图"></el-radio-button>
          </el-radio-group>
          <div class="row">
            <div class="one">
              <IPGeographicDistribution
                ref="ipg"
                class="charts"
                :dateSearch="dateSearch"
                :realmNameArr="realmNameArr"
                :realmName="realmName"
                v-show="radioView === '热力图'"
              ></IPGeographicDistribution>
              <IPGeographicPattern
                ref="ipgp"
                class="charts"
                :dateSearch="dateSearch"
                :realmNameArr="realmNameArr"
                :realmName="realmName"
                v-show="radioView === '柱形图'"
              ></IPGeographicPattern>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  queryNginxByCondition,
  getNginxInfoById,
  addNginxInfo,
  addNginxInfoNew,
  getProductList,
  deleteNginxInfo,
  applyCertificate,
  cancleApply,
  updateNginxDeployStatus,
  updateNginxAllDeployStatus,
  updateNginxParseStatus,
  updateNginxAllParseStatus,
  getNginxInfo,
  updateNginxInfo,
  getSafeNginxInfo,
  getWhiteGroupListNew,
  getBlackGroupListNew,
  updateSafeInfo,
  getMoreNginxInfo,
  getCountryList,
  getCountryGroupListNew,
  updateMoreNginx,
  clearCache,
  getSslNginxInfo,
  updatePemContent,
  searchHttpCode,
  searchVisitUrl,
  searchResponseTime,
  searchVisitMap,
  getContactInformationById,
  updateContactInformation,
  searchNetflow,
  getNginxState,
  getParseListByNginxId,
  deployNginxFile,
  getProductListNew,
  getSiteDnsKidnapData,
} from "@/api/site";
import { openFilebeat } from "@/api/product";
import visitCode from "./components/visitCode";
import urlPath from "./components/urlPath";
import visitCount from "./components/visitCount";
import averageResponseTime from "./components/averageResponseTime";
import IPGeographicDistribution from "./components/IPGeographicDistribution";
import trafficDrawer from "./components/trafficDrawer";
import IPGeographicPattern from "./components/IPGeographicPattern";
import pvAndUvCount from "./components/pvAndUvCount";
import reptileCount from "./components/reptileCount";
import flowStatistics from "./components/flowStatistics";
import ipTop20 from "./components/ipTop20";
import { getPowerGroup } from "@/api/user.js";
import { allocationPowerData, getAllocationPowerData } from "@/api/auth.js";
import {
  splitArr,
  baseBus,
  getRouterId,
  distributionDepartment,
} from "@/utils/filter";
export default {
  components: {
    trafficDrawer,
    visitCode,
    urlPath,
    visitCount,
    averageResponseTime,
    pvAndUvCount,
    reptileCount,
    IPGeographicDistribution,
    IPGeographicPattern,
    flowStatistics,
    ipTop20,
  },
  data() {
    const realmNameReg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    const realmNameRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写域名"));
      } else {
        if (!realmNameReg.test(value) && value != "") {
          callback(new Error("请输入正确的域名"));
        } else {
          callback();
        }
      }
    };
    const redirectUrl = (rule, value, callback) => {
      if (!this.base.redirect) {
        callback();
        return;
      }
      if (!value) {
        callback(new Error("请填写重定向域名"));
      } else {
        const reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
        // const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        if (!reg.test(value) && value != "") {
          callback(new Error("请输入正确的域名"));
        } else {
          callback();
        }
      }
    };
    const addRealmNameRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写域名"));
      } else {
        const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
        let _arr = splitArr(value);
        if (
          _arr.every((item) => {
            if (!reg.test(item)) {
              return false;
            } else {
              return true;
            }
          })
        ) {
          callback();
        } else {
          callback(new Error("请输入正确的域名"));
        }
      }
    };
    const lipsRule = (rule, value, callback) => {
      let _thisIndex = Number(rule.field.split(".")[1]);
      if (value == "" || value == undefined || value == null) {
        if (
          this.base.localNames[_thisIndex].localName == "" &&
          this.base.localNames[_thisIndex].localUrl == ""
        ) {
          callback();
        } else {
          callback(new Error("请输入路径对应ip"));
        }
      } else {
        let _lips = value.split(",");
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
        const regp = /^((25[0-5]|2[0-4]\d|[1]{1}\d{1}\d{1}|[1-9]{1}\d{1}|\d{1})($|(?!\.$)\.)){4}$/;
        if (
          _lips.every((item) => {
            if (!reg.test(item)) {
              if (!regp.test(item)) {
                return false;
              } else {
                return true;
              }
            } else {
              return true;
            }
          })
        ) {
          callback();
        } else {
          callback(new Error("请输入正确的IP地址"));
        }
      }
    };
    const ipRule = (rule, value, callback) => {
      let _thisIndex = Number(rule.field.split(".")[1]);
      if (value == "" || value == undefined || value == null) {
        if (this.dialogAddVisible) {
          if (this.addSiteForm.ipTypes[_thisIndex].ipType === 0) {
            callback(new Error("请输入IP地址"));
          } else {
            callback(new Error("请输入域名"));
          }
        } else if (this.dialogEditVisible) {
          if (this.base.ipTypes[_thisIndex].ipType === 0) {
            callback(new Error("请输入IP地址"));
          } else {
            callback(new Error("请输入域名"));
          }
        }
      } else {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
        const regp = /^((25[0-5]|2[0-4]\d|[1]{1}\d{1}\d{1}|[1-9]{1}\d{1}|\d{1})($|(?!\.$)\.)){4}$/;
        if (this.dialogAddVisible) {
          if (this.addSiteForm.ipTypes[_thisIndex].ipType === 0) {
            if (!reg.test(value)) {
              if (!regp.test(value)) {
                callback(new Error("请输入正确的IP地址"));
              } else {
                callback();
              }
            } else {
              callback();
            }
            if (!reg.test(value)) {
              callback(new Error("请输入正确的IP地址"));
            } else {
              callback();
            }
          } else {
            if (!realmNameReg.test(value) && value != "") {
              callback(new Error("请输入正确的域名"));
            } else {
              if (
                JSON.stringify(this.addSiteForm.realmName).indexOf(value) !== -1
              ) {
                callback(new Error("请勿输入站点相同域名"));
              } else {
                callback();
              }
            }
          }
        } else if (this.dialogEditVisible) {
          if (this.base.ipTypes[_thisIndex].ipType === 0) {
            if (!reg.test(value)) {
              if (!regp.test(value)) {
                callback(new Error("请输入正确的IP地址"));
              } else {
                callback();
              }
            } else {
              callback();
            }
            if (!reg.test(value)) {
              callback(new Error("请输入正确的IP地址"));
            } else {
              callback();
            }
          } else {
            if (!realmNameReg.test(value) && value != "") {
              callback(new Error("请输入正确的域名"));
            } else {
              if (JSON.stringify(this.base.realmName).indexOf(value) !== -1) {
                callback(new Error("请勿输入站点相同域名"));
              } else {
                callback();
              }
            }
          }
        }
        // callback()
      }
    };
    const lips = (rule, value, callback) => {
      if (value == "" || value == undefined || value == null) {
        callback();
      } else {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
        const regp = /^((25[0-5]|2[0-4]\d|[1]{1}\d{1}\d{1}|[1-9]{1}\d{1}|\d{1})($|(?!\.$)\.)){4}$/;
        if (!reg.test(value)) {
          if (!regp.test(value)) {
            callback(new Error("请输入正确的IP地址"));
          } else {
            callback();
          }
        } else {
          callback();
        }
        if (!reg.test(value)) {
          callback(new Error("请输入正确的IP地址"));
        } else {
          callback();
        }
        // callback()
      }
    };
    const portNumRule = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (value == "22") {
          callback(new Error("端口号不可填写为‘22’"));
        } else {
          callback();
        }
      }
    };
    const moreRule = (rule, value, callback) => {
      let reg = /^[1-9]\d*$/;
      if (value === "") {
        callback();
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入大于零的正整数"));
        } else {
          callback();
        }
      }
    };
    const downloadRateRule = (rule, value, callback) => {
      let reg = /^[1-9]\d*$/;
      if (value === "") {
        callback();
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入大于零的正整数"));
        } else {
          if (value > 2000000000) {
            callback(new Error("网站的最大下载速率不可大于2,000,000,000k/s"));
          } else {
            callback();
          }
        }
      }
    };
    const localNameRule = (rule, value, callback) => {
      // let reg = /^\S*$/;
      let reg = /^[a-zA-Z0-9\/]*$/;
      let _thisIndex = Number(rule.field.split(".")[1]);
      if (value == "" || value == undefined || value == null) {
        if (
          this.base.localNames[_thisIndex].lips == "" &&
          this.base.localNames[_thisIndex].localUrl == ""
        ) {
          callback();
        } else {
          callback(new Error("请输入路径"));
        }
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入正确的路径"));
        } else {
          callback();
        }
      }
    };
    const localUrlRule = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9\/]*$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的路径"));
      } else {
        callback();
      }
    };
    const ipRoles = (rule, value, callback) => {
      const reg = /^((25[0-5]|2[0-4]\d|[1]{1}\d{1}\d{1}|[1-9]{1}\d{1}|\d{1})($|(?!\.$)\.)){4}$/;
      const rege = /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([1-9]|[1-2]\d|3[0-2])$/;
      if (!value) {
        callback();
      } else {
        let _ips = value.split(",");
        if (
          _ips.every((item) => {
            if (!reg.test(item)) {
              if (!rege.test(item)) {
                return false;
              } else {
                return true;
              }
            } else {
              return true;
            }
          })
        ) {
          callback();
        } else {
          callback(new Error("输入格式不合法"));
        }
      }
    };
    let phoneNumber = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        if (value.length < 11) {
          callback(new Error("请输入正确格式的手机号"));
        } else {
          const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
          if (!reg.test(value)) {
            callback(new Error("请输入正确格式的手机号"));
          } else {
            callback();
          }
        }
      }
    };
    let email = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式的邮箱"));
        } else {
          callback();
        }
      }
    };
    let qqNumber = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        const reg = /^[1-9][0-9]{4,9}$/gim;
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式的qq号"));
        } else {
          callback();
        }
      }
    };
    return {
      dialogVisibleDnsKidnapData: false, // dns劫持列表弹窗
      dnsKidnapList: [],
      addLoading: false, // 添加按钮loading动画
      deployList: [], // 站点部署列表
      parseList: [], // 站点解析列表
      parseStatusAll: false, // 站点一键解析
      deployStatusAll: false, // 站点一键部署
      radioView: "热力图", // 柱形图,人力图切换tab
      logShow: false, // 日志统计
      dateSearch: [
        // [开始时间, 结束时间]   1 个小时
        new Date(new Date().getTime() - 3600 * 1000),
        new Date(),
      ],
      mark: 2, // 默认下标
      btnList: [
        { label: "10分钟", value: 600000 },
        { label: "30分钟", value: 1800000 },
        { label: "1小时", value: 3600000 },
        { label: "6小时", value: 21600000 },
      ],
      realmNameArr: [], // 域名数组  日志统计使用
      reuse: false, // 判断是否复用操作
      addIpAct: false, // 判断是否添加ip动作
      list: [],
      total: 0, // 总记录数
      searchMap: {
        realmName: "",
        productName: "",
        nginxState: "",
        sslStatus: "",
        parseStatus: "",
      },
      activeTabName: "base", // 修改站点信息下的tab名
      dialogAddVisible: false,
      dialogEditVisible: false,
      dialogDeploy: false, // 部署弹窗状态
      dialogParse: false, // 解析弹窗状态
      activeIndex1: "1",
      activeIndex2: "1",
      arrayIPAdd: [], // 后端IP 点击添加使用
      arrayHost: [], // 基础 域名
      arrayIPBase: [], // 基础 后端IP
      arrayLocalBase: [], // 基础 路径
      whiteGroupList: [], // 白名单安全组
      blackGroupList: [], // 黑名单安全组
      arrayCountry: [], // 国家隔离安全组
      realmName: [], // // 修改临时 域名
      addSiteForm: {
        productId: "", //  当前产品id
        type: 1, // 协议类型 1.http 2.https
        // recordLine: 0, // 路线类型
        realmName: "", // 用户输入的域名
        portNum: "", // 端口号
        ipTypes: [
          {
            ip: "",
            type: "web",
            ipType: 0,
            ableStatus: 1,
          },
        ],
        multiplexId: "", // 站点id 复用cname用
        remark: "", // 备注
        originPrivkey: "", // 私钥文本域
        originFullchain: "", // 证书文本域
      },
      safeRules: {
        banTime: [{ validator: moreRule, trigger: "blur" }],
        banRole: [{ validator: moreRule, trigger: "blur" }],
        whiteLists: [{ validator: ipRoles, trigger: "blur" }],
        blackLists: [{ validator: ipRoles, trigger: "blur" }],
      },
      moreRules: {
        ipNum: [{ required: true, validator: moreRule, trigger: "blur" }],
        serverNum: [{ required: true, validator: moreRule, trigger: "blur" }],
        downloadRate: [
          { required: true, validator: downloadRateRule, trigger: "blur" },
        ],
      },
      sslRules: {
        privkey: [
          {
            required: true,
            message: "私钥文本域内容不能为空",
            trigger: "blur",
          },
        ],
        fullchain: [
          {
            required: true,
            message: "证书文本域内容不能为空",
            trigger: "blur",
          },
        ],
      },
      msgRules: {
        phoneNumber: [{ validator: phoneNumber, trigger: "blur" }],
        email: [{ validator: email, trigger: "blur" }],
        qqNumber: [{ validator: qqNumber, trigger: "blur" }],
      },
      addRules: {
        productId: [
          { required: true, message: "必填项不能为空", trigger: "change" },
        ],
        lips: [{ validator: lips, trigger: "blur" }],
        realmName: [
          { required: true, validator: addRealmNameRule, trigger: "blur" },
        ],
        portNum: [{ validator: portNumRule, trigger: "blur" }],
        ip: [{ required: true, validator: ipRule, trigger: "blur" }],
        remark: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
        originPrivkey: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
        originFullchain: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
      },
      rules: {
        productId: [
          { required: true, message: "必填项不能为空", trigger: "change" },
        ],
        lips: [{ validator: lips, trigger: "blur" }],
        redirectUrl: [
          { required: true, validator: redirectUrl, trigger: "blur" },
        ],
        localName: [{ validator: localNameRule, trigger: "blur" }],
        localUrl: [{ validator: localUrlRule, trigger: "blur" }],
        realmName: [
          { required: true, validator: realmNameRule, trigger: "blur" },
        ],
        portNum: [{ validator: portNumRule, trigger: "blur" }],
        ip: [{ required: true, validator: ipRule, trigger: "blur" }],
        lips: [{ validator: lipsRule, trigger: "blur" }],
        remark: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
        originPrivkey: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
        originFullchain: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
      },
      editId: "", // 修改站点Id
      deployErrorMsg: "", // 部署失败原因
      siteId: "", // 站点ID部署或解析用
      productArr: [], // 存储后台传递过来的产品数组
      redirect: 1,
      base: {
        redirectType: 1, // 重定向类型
        redirectUrl: "", // 重定向域名
        productName: "", // 产品名称
        redirect: 0, // 重定向开关
        // recordLine: 0,
        type: "", // 协议类型 1.http 2.https
        realmName: "", // 域名
        portNum: "", // 端口
        remark: "", // 备注
        ipTypes: [
          {
            ip: "", // 后端ip地址 用,隔开
            type: "", // IP类型
            ipType: 0, // ip或者域名
            ableStatus: 1, // 是否暂停
          },
        ],
        localNames: {
          localUrl: "", // 反向代理路径
          localName: "", // 路径
          lips: "", // 路径对应IP
          gzipStatus: 0, // gzip开启状态 0.关闭 1开启
          longLink: 0, // 长链接开关 0.为关 1.为开
        },
        originPrivkey: "",
        originFullchain: "",
      },
      safe: {
        whiteLists: "", // 白名单
        whiteGroups: [], // 白名单安全组
        blackLists: "", // 黑名单
        blackGroups: [], // 黑名单安全组
        logAnalysis: 0,
        banTime: 0,
        banRole: 0,
        ccSwitch: false,
        ccType: "1",
        antiProxyIp: 0,
        safeValue: [],
        safeSwitch: "1",
      },
      wafDefendList: [
        {
          label: "cookie",
          name: "cookie安全防护",
          desc: "防止基于SQL注入命令注入",
        },
        // { label: "blockip", name: "黑名单ip检测" },
        { label: "args", name: "参数检测", desc: "防止基于SQL注入命令注入" },
        // { label: "denycc", name: "CC攻击防护" },
        {
          label: "url",
          name: "url过滤的规则",
          desc: "过滤一些特殊后缀结尾的请求URL(例:.svn .bak .css 等)",
        },
        {
          label: "ua",
          name: "User-Agent的过滤",
          desc: "拦截垃圾蜘蛛、爬虫、采集器",
        },
        // { label: "whiteip", name: "白名单ip检测" },
        // { label: "post_check", name: "post数据检测" },
      ],
      ssl: {
        id: "",
        privkey: "", // 私钥文本域
        fullchain: "", // 证书文本域
      },
      contactMsg: {
        phoneNumber: "",
        qqNumber: "",
        email: "",
        skype: "",
      },
      moreCacheType: "",
      more: {
        paidVersionFree: 0,
        timeType: 1, // 缓存时间默认单位
        applyStatus: "", // 证书申请状态
        cacheTime: "", // 设置缓存时间
        countrySafe: 0, // 国家隔离开启状态 0.关闭 1.开启
        countrys: [], // 放行国家id
        countryGroups: [], // 国家安全组id
        gzip: 0, // gzip开启状态 0.关闭 1开启
        gzipTypes: [], // gzip支持的压缩版本类型
        cache: 0, // 缓存开启状态 0.关闭 1.开启
        cacheTypes: [], // 需要缓存的文件类型
        limits: 0, // 访问限制开启状态 0.关闭 1.开启
        ipNum: 10, // 单个ip每秒最大连接数
        serverNum: 500, // 单个网站每秒最大连接数
        downloadRate: 200, // 下载速率限制
        jumpHttps: 0, // 是否强制跳转 0 否  1 是
        cancelHttps: 0, // 是否取消https跳转 0 否 1 是
        siteCrossDomain: 0, // 是否开启站点跨域 0 否 1 是
        reverseProxyCrossDomain: 0, // 是否开启反向代理跨域 0 否 1 是
        dnsKidnapCheck: 0, // 是否开启DNS劫持测试 0 否 1 是
      },
      countrysList: [], // 放行国家 名单
      countryGroupList: [], // 国家安全组 名单
      nodeType: [],
      show: false, // 分配人员名单列表是否显示
      dataListUsername: [], // 存储选中的人员姓名
      dataListIds: [], // 存储选中的人员姓名
      options: [], // 选择框 分配人员列表
      users: [],
      pgNumCode: "", // 组织架构人员
      testNode: [],
      id: "",
      yuminglabel: "展开",
      tableLoading: false,
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    siteTypeList() {
      return this.$store.state.siteTypeList;
    },
    ipTypeList() {
      return this.$store.state.ipTypeList;
    },
    cacheTimeList() {
      return this.$store.state.cacheTimeList;
    },
    gzipTypeList() {
      return this.$store.state.gzipTypeList;
    },
    cacheTypeList() {
      return this.$store.state.cacheTypeList;
    },
    // 协议类型
    agreementList() {
      return this.$store.state.agreementList;
    },
    nginxStateText() {
      if (this.searchMap.nginxState === "") {
        return "部署状态";
      } else {
        return this.$store.state.deployStatusList[this.searchMap.nginxState]
          .text;
      }
    },
    sslStatusText() {
      if (this.searchMap.sslStatus === "") {
        return "证书状态";
      } else {
        return this.$store.state.sslStatusList[this.searchMap.sslStatus].text;
      }
    },
    parseStatusText() {
      if (this.searchMap.parseStatus === "") {
        return "DNS解析状态";
      } else {
        return this.$store.state.parseStatusList[this.searchMap.parseStatus]
          .text;
      }
    },
    // 证书状态筛选
    nginxStateList() {
      return this.$store.state.deployStatusList;
    },
    // 证书申请状态筛选
    sslStatusList() {
      return this.$store.state.sslStatusList;
    },
    // dns解析状态筛选
    parseStatusList() {
      return this.$store.state.parseStatusList;
    },
  },
  beforeDestroy() {
    document.onkeydown = null;
  },
  created() {
    if (this.$route.query.status) {
      this.searchMap.nginxState = Number(this.$route.query.status);
    }
    let that = this;
    this.$nextTick(() => {
      if (this.$route.query.id) {
        this.getNginxInfoById();
      } else {
        this.fetchData();
      }
      document.onkeydown = function(e) {
        //事件对象兼容
        let e1 =
          e || event || window.event || arguments.callee.caller.arguments[0];
        if (e1 && e1.keyCode == 27) {
          that.goBack();
        }
        if (e1 && e1.keyCode == 13) {
          that.searchData();
        }
      };
    });
  },
  mounted() {
    baseBus("site", () => {
      this.fetchData();
      if (this.siteId !== "") {
        this.deployTable(this.siteId);
      }
    });
  },
  methods: {
    // DNS劫持域名列表
    getSiteDnsKidnapData(siteId) {
      this.dialogVisibleDnsKidnapData = true;
      getSiteDnsKidnapData(siteId).then((res) => {
        this.dnsKidnapList = res.data.rows;
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.nginxState == 0) {
        return "warning-row";
      } else {
        return "";
      }
    },
    mouseEnter(row, column, cell, event) {
      let _index = this.list.indexOf(row);
      if (
        document
          .getElementsByClassName("el-table__body-wrapper")[0]
          .getElementsByTagName("tbody")[0].children[_index].className
      ) {
        document
          .getElementsByClassName("el-table__body-wrapper")[0]
          .getElementsByTagName("tbody")[0]
          .children[_index].classList.add("table-hide-color");
        document
          .getElementsByClassName("el-table__fixed-right")[0]
          .getElementsByTagName("tbody")[0]
          .children[_index].classList.add("table-hide-color");
      }
    },
    mouseLeave(row, column, cell, event) {
      let _index = this.list.indexOf(row);
      if (
        !document
          .getElementsByClassName("el-table__body-wrapper")[0]
          .getElementsByTagName("tbody")[0].children[_index]
      ) {
      } else {
        document
          .getElementsByClassName("el-table__body-wrapper")[0]
          .getElementsByTagName("tbody")[0]
          .children[_index].classList.remove("table-hide-color");
        document
          .getElementsByClassName("el-table__fixed-right")[0]
          .getElementsByTagName("tbody")[0]
          .children[_index].classList.remove("table-hide-color");
      }
    },
    checkIPStatus(index) {
      if (this.dialogEditVisible) {
        this.base.ipTypes[index].ableStatus === 1
          ? (this.base.ipTypes[index].ableStatus = 0)
          : (this.base.ipTypes[index].ableStatus = 1);
      } else if (this.dialogAddVisible) {
        this.addSiteForm.ipTypes[index].ableStatus === 1
          ? (this.addSiteForm.ipTypes[index].ableStatus = 0)
          : (this.addSiteForm.ipTypes[index].ableStatus = 1);
      }
    },
    deployTable(id) {
      this.siteId = id;
      this.dialogDeploy = true;
      getNginxState(id).then((res) => {
        this.deployList = res.data.rows.map((item) => {
          return { ...item, tableStep: item.step == 4 ? 4 : item.step - 1 };
        });
      });
    },
    yumingShowClick() {
      this.yuminglabel = this.yuminglabel == "收起" ? "展开" : "收起";
    },
    yumingShow(ind) {
      return this.yuminglabel == "展开" ? ind == 0 : true;
    },
    // 状态筛选
    statusFilter(filter) {
      if (filter.nginxState) {
        if (filter.nginxState.length === 1) {
          this.searchMap.nginxState = filter.nginxState[0];
        } else {
          this.searchMap.nginxState = "";
        }
      }
      if (filter.sslStatus) {
        if (filter.sslStatus.length === 1) {
          this.searchMap.sslStatus = filter.sslStatus[0];
        } else {
          this.searchMap.sslStatus = "";
        }
      }
      if (filter.parseStatus) {
        if (filter.parseStatus.length === 1) {
          this.searchMap.parseStatus = filter.parseStatus[0];
        } else {
          this.searchMap.parseStatus = "";
        }
      }
      this.searchData();
    },
    filterTag() {
      return true;
    },
    // 切换ipType
    handleCommand(item) {
      // if (item.oldVal !== item.newVal) {
      //   this.base.ipTypes[item.index].ip = ''
      // }
      if (this.dialogAddVisible) {
        this.addSiteForm.ipTypes[item.index].ipType = item.newVal;
      } else if (this.dialogEditVisible) {
        this.base.ipTypes[item.index].ipType = item.newVal;
      }
    },
    goBack() {
      this.logShow = false;
      this.realmNameArr = [];
      this.realmName = [];
      this.mark = 2;
    },
    trafficClick(id) {
      this.id = id;
      this.$refs.nodeTraffic.initDrawer(id);
    },
    logStatisticsClick(id, realmName, isFilebeat, productId) {
      if (isFilebeat == 0) {
        this.$confirm("请先开启产品的日志采集功能!", "提示", {
          confirmButtonText: "开启",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            openFilebeat(productId, 1).then((res) => {
              this.fetchData();
            });
          })
          .catch(() => {});
      } else if (isFilebeat == 1) {
        this.logShow = true;
        this.id = id;
        this.realmNameArr = realmName.split(" ");
        this.$set(
          this.dateSearch,
          0,
          new Date(new Date().getTime() - 3600 * 1000)
        );
        this.$set(this.dateSearch, 1, new Date());
        this.searchTimeBtn();
      } else if (isFilebeat == 2) {
        this.$message({
          message: "对应产品日志采集切换中,请稍后再试!",
          type: "warning",
        });
      }
    },

    // 点击  时间
    handlerTimeBtn(index, timeValue) {
      this.mark = index;
      this.$set(this.dateSearch, 1, new Date());
      this.$set(this.dateSearch, 0, new Date(this.dateSearch[1] - timeValue));
      this.searchTimeBtn();
    },
    ipEchartChange(name) {
      if (name === "柱形图") {
        this.$refs.ipgp.searchIpPattern();
      }
    },
    // 日志统计 时间控件后按钮
    searchTimeBtn() {
      // 一次只能查询 6 个小时的数据
      let timeRange =
        this.dateSearch[1].getTime() - this.dateSearch[0].getTime();
      if (this.dateSearch[1].getTime() > new Date().getTime()) {
        this.$message({
          message: "只能查询当前时间之前的数据，请重新输入时间",
          type: "warning",
        });
      } else if (timeRange <= 6 * 60 * 60 * 1000) {
        this.$nextTick(() => {
          this.$refs.visitCount.searchVisitCount();
          this.$refs.visitCode.searchHttpCode();
          this.$refs.art.searchResponseTime();
          this.$refs.flow.searchNetflow();
          this.$refs.ipTop20.searchIpTop();
          this.$refs.urlPath.searchVisitUrl();
          this.$refs.reptileCount.searchReptileCount();
          this.$refs.pvuv.searchPvAndUvCount();
          this.$refs.ipg.initMap();
          this.$refs.ipgp.searchIpPattern();
        });
      } else {
        this.$message({
          message: "一次最多查询 6 个小时的数据，请重新输入时间",
          type: "warning",
        });
      }
    },

    handleChange(node) {
      this.pgNumCode = distributionDepartment(
        this.testNode,
        node,
        this.pgNumCode
      );
      this.testNode = this.pgNumCode;
    },

    resetDataSpace(val) {
      return String(val).replace(/^\s+|\s+$/g, "");
    },

    // 关闭重置部署失败弹窗提示
    resetDialogDeploy() {
      this.siteId = "";
      this.deployStatusAll = false;
      this.deployList = [];
      this.parseStatusAll = false;
      this.parseList = [];
    },

    // 初始化数据
    init() {
      this.addSiteForm = {
        productId: "", //  当前产品id
        type: 1, // 协议类型 1.http 2.https
        realmName: "", // 用户输入的域名
        // recordLine: 0,
        // realmName: [''], // 用户输入的域名
        portNum: "", // 端口号
        ipTypes: [
          {
            ip: "",
            type: "web",
            ipType: 0,
            ableStatus: 1,
          },
        ], // 后端ip地址用,隔开
        multiplexId: "", // 站点id 复用cname用
        remark: "", // 备注
        originPrivkey: "", // 私钥文本域
        originFullchain: "", // 证书文本域
      };
      if (this.activeIndex2 == "1") {
        if (this.redirect == 0) {
          this.$refs["safe"].resetFields();
          this.$refs["more"].resetFields();
        }
        this.$refs["ssl"].resetFields();
        this.$refs["base"].resetFields();
      }
      this.testNode = [];
      this.base.ipTypes = [
        {
          ip: "",
          type: "",
          ipType: 0,
          ableStatus: 1,
        },
      ];
      this.activeTabName = "base";
      this.users = [];
      this.editId = "";
      this.dataListIds = [];
      this.dataListUsername = [];
      this.arrayIPAdd = [];
      this.arrayHost = [];
      this.arrayIPBase = [];
      this.arrayLocalBase = [];
      this.whiteGroupList = [];
      this.blackGroupList = [];
      this.arrayCountry = [];
      this.yuminglabel = "展开";
    },

    clearInput() {
      this.searchMap.realmName = "";
      this.searchMap.productName = "";
      this.searchMap.nginxState = "";
    },

    // 搜索列表数据
    searchData() {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    },
    // 根据id查询站点数据
    getNginxInfoById() {
      getNginxInfoById(this.$route.query.id).then((res) => {
        this.list = [res.data];
        this.total = 1;
      });
    },
    // 获取站点列表数据
    fetchData() {
      this.tableLoading = true;
      queryNginxByCondition(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.realmName,
        this.searchMap.productName,
        this.searchMap.nginxState,
        this.searchMap.sslStatus
      )
        .then((res) => {
          this.tableLoading = false;
          this.list = res.data.rows;
          this.total = res.data.total;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    // 提交修改
    submitEdit(formName) {
      if (this.activeTabName == "base") {
        this.editSiteBase();
      } else if (this.activeTabName == "safe") {
        this.editSiteSafe();
      } else if (this.activeTabName == "ssl") {
        this.editSiteSsl();
      } else if (this.activeTabName == "contactMsg") {
        this.editSiteMsg();
      } else if (this.activeTabName == "more") {
        this.editSiteMore();
      }
    },
    // 获取 分配组织架构
    getPowerGroup() {
      getPowerGroup("", 2).then((res) => {
        this.options = res.data;
        // this.options = res.data[0].child;
      });
    },

    // 点击编辑回显 分配组织架构
    getAllocationPowerData() {
      getAllocationPowerData(this.editId, getRouterId(this.$route.path)).then(
        (res) => {
          // let _pgNumCode = res.data.map(ele => {
          //   return ele.slice(1)
          // })
          // console.log(_pgNumCode)
          // this.pgNumCode = _pgNumCode;
          this.pgNumCode = res.data;
        }
      );
    },
    // 点击编辑 => 站点信息
    handleSelect(index) {
      // console.log(index,321)
      this.activeIndex2 = index;
      if (this.activeIndex2 == "2") {
        this.testNode = [];
        // 获取 分配组织架构 选择项内容
        this.getPowerGroup();
        // 点击编辑回显 分配组织架构
        this.getAllocationPowerData();
      }
    },
    // 点击编辑 => 修改站点信息切换
    handleTabClick() {
      // console.log(1111111)
      if (this.redirect == 0) {
        this.$refs["safe"].resetFields();
        this.$refs["more"].resetFields();
      }
      this.$refs["ssl"].resetFields();
      this.$refs["base"].resetFields();
      if (this.activeTabName == "base") {
        this.siteBase();
      } else if (this.activeTabName == "safe") {
        this.siteSafe();
      } else if (this.activeTabName == "ssl") {
        this.siteSsl();
      } else if (this.activeTabName == "contactMsg") {
        this.siteMsg();
      } else if (this.activeTabName == "more") {
        this.siteMore();
      }
    },
    // 添加一行ip信息
    addIP() {
      this.addSiteForm.ipTypes.push({
        ip: "",
        type: "web",
        ipType: 0,
        ableStatus: 1,
      });
    },
    // 删除一行
    delIP(index) {
      this.addSiteForm.ipTypes.splice(index, 1);
    },
    // 单个重新部署
    updateNginxDeployStatus(data) {
      updateNginxDeployStatus(this.siteId, data.id).then((res) => {
        this.deployTable(this.siteId);
        this.fetchData();
      });
    },
    // 预部署状态部署
    deployNginxFile(id) {
      deployNginxFile(id).then((res) => {
        this.fetchData();
      });
    },
    // 一键重新部署
    updateNginxAllDeployStatus() {
      updateNginxAllDeployStatus(this.siteId).then((res) => {
        // this.clearInput();
        this.fetchData();
        this.dialogDeploy = false;
      });
    },
    // 单个重新解析
    updateNginxParseStatus(data) {
      updateNginxParseStatus(this.siteId, data.id).then((res) => {
        this.deployTable(this.siteId);
        this.fetchData();
      });
    },
    // 一键重新解析
    updateNginxAllParseStatus() {
      updateNginxAllParseStatus(this.siteId).then((res) => {
        // this.clearInput();
        this.fetchData();
        this.dialogDeploy = false;
      });
    },
    addHost(item) {
      this.yuminglabel = "收起";
      this[item].realmName.push("");
    },
    // 删除一行
    delHost(index, item) {
      this[item].realmName.splice(index, 1);
    },
    addIPBase() {
      this.base.ipTypes.push({
        ip: "",
        type: "web",
        ipType: 0,
        ableStatus: 1,
      });
    },
    delIPBase(index) {
      this.base.ipTypes.splice(index, 1);
    },
    addLocalBase() {
      this.base.localNames.push({
        localUrl: "",
        localName: "",
        longLink: 0,
        lips: "",
        gzipStatus: 0,
      });
    },
    delLocalBase(index) {
      this.base.localNames.splice(index, 1);
    },
    addCountry() {
      this.arrayCountry.push(1);
    },
    handlerAdd(type, item) {
      this.reuse = type;
      if (!item) {
        this.addSiteForm.productId = "";
        this.getProductList();
      } else {
        this.addSiteForm.productId = item.productId;
        this.addSiteForm.multiplexId = item.id;
        this.getProductListNew(item.id);
      }
      this.dialogAddVisible = true;
      // this.ipTypeList = this.$store.state.ipTypeList;
      // 返回第一个 tab导航 并置空
      this.handleSelect("1");
    },
    // 新增查询产品列表
    getProductList() {
      getProductList(1).then((res) => {
        this.productArr = res.data.rows;
      });
    },
    // 编辑查询产品列表
    getProductListNew(id) {
      getProductListNew(id).then((res) => {
        this.productArr = res.data;
      });
    },
    // 点击编辑
    handlerEdit(id) {
      this.editId = id;
      this.dialogEditVisible = true;
      // 返回第一个 tab导航 并置空
      this.handleSelect("1");
      this.$nextTick(() => {
        this.$refs["base"].resetFields();
      });
      this.siteBase();
    },
    // 点击编辑 => 修改站点信息 => 基础信息
    siteBase() {
      this.getProductListNew(this.editId);
      getNginxInfo(this.editId).then((res) => {
        //  console.log(res,1122)
        if (res.data.localNames.length <= 0) {
          res.data.localNames = [
            {
              localUrl: "",
              localName: "",
              longLink: 0,
              lips: "",
              gzipStatus: 0,
            },
          ];
        }
        this.base = res.data;
        this.redirect = this.base.redirect;
      });
    },
    safeCcRadio() {
      this.safe.ccDefense = -1;
    },
    // 点击编辑 => 修改站点信息 => 基础 => 修改
    editSiteBase() {
      this.yuminglabel = "收起";
      this.$refs["base"].validate((valid) => {
        if (valid) {
          this.base.localNames = this.base.localNames.filter((item) => {
            return (
              item.localUrl !== "" ||
              item.localName !== "" ||
              item.lips !== "" ||
              item.gzipStatus !== 0 ||
              item.longLink !== 0
            );
          });
          if (this.base.localNames.length <= 0) {
            this.base.localNames.push({
              localUrl: "",
              localName: "",
              lips: "",
              gzipStatus: 0,
              longLink: 0,
            });
          } else {
            if (
              this.base.localNames.some((item) => {
                return (
                  (item.localName === "" &&
                    item.lips === "" &&
                    item.localUrl !== "") ||
                  (item.localName !== "" && item.lips === "") ||
                  (item.localName !== "" && item.lips === "") ||
                  ((item.gzipStatus !== 0 || item.longLink !== 0) &&
                    (item.localName === "" || item.lips === ""))
                );
              })
            ) {
              this.$message.error("请填写正确的路径信息");
              return false;
            }
          }
          if (this.base.type === 1) {
            this.base.originPrivkey = "";
            this.base.originFullchain = "";
          }
          let _params = {
            id: this.base.id,
            productId: this.base.productId,
            redirect: this.base.redirect,
            redirectType: this.base.redirectType,
            redirectUrl: this.base.redirectUrl,
            // recordLine: this.base.recordLine,
            type: this.base.type,
            realmName: this.base.realmName, // 域名
            portNum: this.base.portNum, // 端口
            remark: this.base.remark, // 备注
            ipTypes: this.base.ipTypes,
            localNames: this.base.localNames.filter((item, index) => {
              return (
                item.localUrl !== "" ||
                item.localName !== "" ||
                item.lips !== "" ||
                item.gzipStatus !== 0 ||
                item.longLink !== 0
              );
            }),
            originPrivkey: this.base.originPrivkey,
            originFullchain: this.base.originFullchain,
          };
          updateNginxInfo(_params).then((res) => {
            // this.clearInput();
            this.fetchData();
            this.dialogEditVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    // 点击编辑 => 修改站点信息 => 更多信息
    siteSafe() {
      this.getWhiteBlackList();
      getSafeNginxInfo(this.editId).then((res) => {
        // this.safeValueArr = res.data.safeValue
        this.safe = res.data;
      });
    },
    // 获取黑白名单安全组
    getWhiteBlackList() {
      // 白名单安全组
      getWhiteGroupListNew(this.editId).then((res) => {
        this.whiteGroupList = res.data;
      });
      // 黑名单安全组
      getBlackGroupListNew(this.editId).then((res) => {
        this.blackGroupList = res.data;
      });
    },
    redirectSwich(val) {
      this.redirect = val;
      this.base.redirectType = 1;
      this.base.redirectUrl = "";
    },
    safeCcSwitch(val) {
      this.safe.ccType = 1;
    },
    logAnalysisSwitch(val) {
      // this.safe.banTime = 2;
      // this.safe.banRole = 20;
    },
    // 点击编辑 => 修改站点信息 => 安全 => 修改
    editSiteSafe() {
      this.$refs["safe"].validate((valid) => {
        if (valid) {
          if (!this.safe.logAnalysis) {
            this.safe.banTime = 2;
            this.safe.banRole = 20;
          } else {
            this.safe.banTime = this.resetDataSpace(this.safe.banTime);
            this.safe.banRole = this.resetDataSpace(this.safe.banRole);
            this.safe.banTime = Number(this.safe.banTime);
            this.safe.banRole = Number(this.safe.banRole);
          }
          // this.safe.safeValue = this.safe.safeValue.slice(1)
          this.safe.safeValue = this.safe.safeValue.filter(
            (item) => item != ""
          );
          updateSafeInfo(this.safe).then((res) => {
            // this.clearInput();
            this.fetchData();
            this.dialogEditVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    safeSwitchChange(val) {
      if (!val) {
        this.safe.safeValue = [];
      }
    },
    siteMsg() {
      getContactInformationById(this.editId).then((res) => {
        this.contactMsg = res.data;
      });
    },
    editSiteMsg() {
      this.$refs["contactMsg"].validate((valid) => {
        if (valid) {
          updateContactInformation(this.contactMsg).then((res) => {
            // this.clearInput();
            this.fetchData();
            this.dialogEditVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    // 点击编辑 => 修改站点信息 => 更多信息
    siteMore() {
      getMoreNginxInfo(this.editId).then((res) => {
        this.more = res.data;
        if (this.more.countrySafe) {
          this.getCountryList();
        }
      });
    },
    // 清除缓存
    cleanCache() {
      this.$confirm("即将清理缓存, 是否继续?", "申请证书", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          clearCache(this.editId).then((res) => {});
        })
        .catch(() => {});
    },
    countrySafeSwitch(val) {
      if (val) {
        this.getCountryList();
      } else {
        this.more.countrys = [];
        this.more.paidVersionFree = 0;
        this.more.countryGroups = [];
      }
    },
    cacheSwitch(val) {
      if (val) {
        this.more.cacheTypes = this.$store.state.cacheTypeList.map((item) => {
          return item.label;
        });
      } else {
        this.more.cacheTypes = [];
      }
    },
    gzipSwitch(val) {
      if (val) {
        this.more.gzipTypes = this.$store.state.gzipTypeList.map((item) => {
          return item.label;
        });
      } else {
        this.more.gzipTypes = [];
      }
    },
    limitsSwitch() {
      this.more.ipNum = 10;
      this.more.serverNum = 500;
      this.more.downloadRate = 200;
    },
    jumpHttpsSwitch(val) {
      if (val == 0) {
        this.more.cancelHttps = 0;
      }
    },
    // 查询国家列表
    getCountryList() {
      if (this.countrysList.length <= 0) {
        getCountryList().then((res) => {
          this.countrysList = res.data.rows;
        });
      }
      getCountryGroupListNew(this.editId).then((res) => {
        this.countryGroupList = res.data;
      });
    },
    // 点击编辑 => 修改站点信息 => 证书内容设置
    siteSsl() {
      getSslNginxInfo(this.editId).then((res) => {
        this.ssl = res.data;
      });
    },
    // 点击编辑 => 修改站点信息 => 更多 => 修改
    editSiteMore() {
      this.$refs["more"].validate((valid) => {
        if (valid) {
          this.more.ipNum = this.resetDataSpace(this.more.ipNum);
          this.more.serverNum = this.resetDataSpace(this.more.serverNum);
          this.more.downloadRate = this.resetDataSpace(this.more.downloadRate);
          this.more.ipNum = Number(this.more.ipNum);
          this.more.serverNum = Number(this.more.serverNum);
          this.more.downloadRate = Number(this.more.downloadRate);
          updateMoreNginx(this.more).then((res) => {
            // this.clearInput();
            this.fetchData();
            this.dialogEditVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    // 点击编辑 => 修改站点信息 => 证书内容设置 => 修改
    editSiteSsl() {
      this.ssl.privkey = this.resetDataSpace(this.ssl.privkey);
      this.ssl.fullchain = this.resetDataSpace(this.ssl.fullchain);
      this.$refs["ssl"].validate((valid) => {
        if (valid) {
          updatePemContent(this.ssl).then((res) => {
            // this.clearInput();
            this.fetchData();
            this.dialogEditVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    // 申请证书
    handleApplyCertificate(status, id, productId, pemType) {
      if (status == "2") {
        // 证书申请成功
        if (pemType == 1) {
          this.$confirm("即将申请证书, 是否继续?", "申请证书", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          })
            .then(() => {
              this.applyCertificate(id, productId);
            })
            .catch(() => {});
        }
      } else if (status == "1" || status == "3") {
        // 证书申请中，可取消申请
        // this.$confirm("取消申请证书, 是否继续?", "取消申请", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning"
        // })
        //   .then(() => {
        //     this.cancleApply(id);
        //   })
        //   .catch(() => {});
      } else if (status == "0") {
        this.$confirm("即将申请证书, 是否继续?", "申请证书", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        })
          .then(() => {
            this.applyCertificate(id, productId);
          })
          .catch(() => {});
      } else if (status == "4" || status == "5") {
        this.$confirm("即将再次申请证书, 是否继续?", "申请证书", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        })
          .then(() => {
            this.applyCertificate(id, productId);
          })
          .catch(() => {});
      }
    },
    // 修改站点分配的系统用户
    submitSave() {
      // 转换
      let _pgNumCode = this.pgNumCode
        .map((ele) => {
          return ele[ele.length - 1];
        })
        .join(",");

      allocationPowerData(
        _pgNumCode,
        this.editId,
        getRouterId(this.$route.path)
      ).then((res) => {
        this.dialogEditVisible = false;
      });
    },
    // 申请证书
    applyCertificate(id, productId) {
      applyCertificate(id, productId).then((res) => {
        // this.clearInput();
        this.fetchData();
      });
    },
    // 取消申请证书
    cancleApply(id) {
      cancleApply(id).then((res) => {
        // this.clearInput();
        this.fetchData();
      });
    },
    // 删除站点操作
    handlerDelete(id, productId) {
      this.$confirm("此操作将永久删除该站点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteNginxInfo(id, productId).then((res) => {
            // this.clearInput();
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    // 重置 按钮
    resetForm(formName, type) {
      // 移除表单校验
      if (type === "edit") {
        this.base.ipTypes = [
          {
            ip: "",
            type: "web",
            ipType: 0,
            ableStatus: 1,
          },
        ];
        this.dialogEditVisible = false;
      } else {
        this.$nextTick(() => {
          this.$refs[formName].resetFields();
        });
        this.addSiteForm = {
          productId: "", //  当前产品id
          type: 1, // 协议类型 1.http 2.https
          // recordLine: 0,
          realmName: "", // 用户输入的域名
          // realmName: [''], // 用户输入的域名
          portNum: "", // 端口号
          ipTypes: [
            {
              ip: "",
              type: "web",
              ipType: 0,
              ableStatus: 1,
            },
          ], // 后端ip地址用,隔开
          multiplexId: "", // 站点id 复用cname用
          remark: "", // 备注
          originPrivkey: "", // 私钥文本域
          originFullchain: "", // 证书文本域
        };
      }
    },
    // 新增对话框 提交
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addSiteForm.type === 1) {
            this.addSiteForm.originPrivkey = "";
            this.addSiteForm.originFullchain = "";
          }
          let _params = {
            productId: this.addSiteForm.productId,
            type: this.addSiteForm.type,
            // recordLine: this.addSiteForm.recordLine,
            realmName: splitArr(this.addSiteForm.realmName),
            portNum: this.addSiteForm.portNum,
            ipTypes: this.addSiteForm.ipTypes,
            multiplexId: this.addSiteForm.multiplexId,
            remark: this.addSiteForm.remark,
            originPrivkey: this.addSiteForm.originPrivkey,
            originFullchain: this.addSiteForm.originFullchain,
          };
          this.addLoading = true;
          if (!this.reuse) {
            this.addNginxInfo(_params);
          } else {
            this.addNginxInfoNew(_params);
          }
        } else {
          return false;
        }
      });
    },
    // 新增站点
    addNginxInfo(params) {
      addNginxInfo(params).then((res) => {
        this.currentPage = 1;
        // 刷新列表
        // this.clearInput();
        this.fetchData();
        // 刷新完成后 需要关闭弹框
        this.dialogAddVisible = false;
        this.addLoading = false;
      });
      setTimeout(() => {
        this.addLoading = false;
      }, 3000);
    },
    // 复用cname
    addNginxInfoNew(params) {
      addNginxInfoNew(params).then((res) => {
        this.currentPage = 1;
        // 刷新列表
        // this.clearInput();
        this.fetchData();
        // 刷新完成后 需要关闭弹框
        this.dialogAddVisible = false;
        this.addLoading = false;
      });
      setTimeout(() => {
        this.addLoading = false;
      }, 3000);
    },
  },
};
</script>

<style scoped>
.el-menu-item {
  position: relative;
}
.el-menu-item .el-button {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.log-statistics {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  border: 20px solid #f4f4f4;
  background-color: #fff;
  overflow: auto;
  z-index: 100;
}

.log-statistics::-webkit-scrollbar {
  display: none;
}

.header {
  padding: 20px 32px 2px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  border-bottom: 20px solid #f4f4f4;
}
.redirect-switch {
  height: 32px;
}
.redirect-group {
  margin-left: 72px;
}
.font-tail2 {
  line-height: 18px;
  height: 36px;
  align-items: center;
  border-radius: 4px 4px 0 0;
  border-bottom: 20px solid #f4f4f4;
}

.header .header-left .time-select,
.header ul {
  display: flex;
  display: -webkit-flex;
}

.time-select {
  margin: 0 0 18px;
}

.header-right {
  line-height: 66px;
}

/* 时间按钮 */
.header ul li.timeBtn,
.el-select__tags-text {
  box-sizing: border-box;
  width: 60px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  color: #606266;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  border-radius: 4px;
  background-color: #f4f4f4;
  margin-right: 12px;
  cursor: pointer;
}

.header ul li.timeBtn.bgColor {
  background-color: #4d71ee;
  color: #fff;
}

.header-left .time-sel {
  font-size: 14px;
  line-height: 28px;
  padding-left: 8px;
}

.time-search {
  padding-left: 20px;
}

.log-content {
  background: #f7f7f7;
}

.log-content .row {
  display: flex;
  display: -webkit-flex;
  margin-bottom: 10px;
}

.log-content .two,
.log-content .one,
.log-content .three {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  margin-right: 10px;
  box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.1);
}
.log-content .two,
.log-content .one {
  height: 260px;
}
.log-content .three {
  height: 300px;
}
.pvUvReptile {
  flex: 1;
  height: 460px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.log-content .one {
  height: 600px;
  overflow-y: hidden;
}

.charts {
  width: 100%;
  height: 100%;
}

/* 滑动 */
.slide-enter,
.slide-leave-to {
  transform: translateY(100%);
  bottom: -100%;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s ease;
}
.slide-enter-to,
.slide-leave {
  transform: translateY(0px);
  bottom: 0;
}

.redirect-switch {
  height: 32px;
}

.redirect-group {
  margin-left: 72px;
}

.font-tail2 {
  line-height: 18px;
  height: 36px;
  align-items: center;
  font-size: 12px;
  color: #999999;
}

.copy-cname {
  cursor: pointer;
  width: 40px;
  height: 20px;
  font-size: 12px;
  justify-content: center;
  border-radius: 4px;
}
.el-dialog .add-site {
  padding: 32px 40px 0px;
}
.el-dialog .eidt-site {
  padding: 0 20px;
}
.el-dialog .el-form-item {
  margin: 0 0 32px;
}
.el-dialog .inner .el-form-item {
  margin: 0 0 16px;
}
.el-dialog .inner20 .el-form-item {
  margin: 0 0 20px;
}
.el-dialog .inner20 .el-input__inner {
  width: 250px;
}
.el-dialog .el-form-item div.el-input {
  width: 250px;
}
.font-limit-bg {
  display: flex;
  align-items: center;
}
.font-limit {
  font-size: 12px;
  color: #ff7373;
  line-height: 18px;
}
.el-dialog .el-tab-pane {
  border: none;
  color: #666666;
}
.more {
  padding: 0 20px;
}
.flex-space {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}
.cache-time {
  display: flex;
  display: -webkit-flex;
}

.normal {
  padding: 10px 20px 0;
}
.normals {
  padding: 10px 40px 0;
}
/* 多选框向下一行 */
.el-dialog .el-form-item.check {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}
.cache-time .el-input {
  width: 170px;
  margin-right: 20px;
}

.input1,
.site .input2 {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  width: 170px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  border: none;
  background-color: #f7f7f7;
  border-radius: 4px;
  outline: 0;
  padding: 0 15px;
}

.site .reserve .input2 {
  width: 100px;
}

.reserve .input1,
.site .reserve .input2 {
  background-color: #fff;
}
/* 反转颜色 */
.reserve {
  padding: 15px 20px 1px;
  background-color: #f7f7f7;
}
.input2 {
  width: 100px;
}
.select {
  padding-top: 40px;
}
.cname {
  padding-right: 8px;
  padding-right: 8px;
  display: block;
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ban {
  font-size: 12px;
  padding-left: 12px;
  color: #999999;
  line-height: 36px;
}
.ban-tip {
  font-size: 12px;
  color: #999;
  line-height: 16px;
  padding: 0px 0 32px 80px;
}
.ban-tip.other-tip {
  padding: 0 0 0 60px;
}
.ip-input2,
.ip-select {
  width: 100px !important;
}
.ip-select {
  padding: 0 !important;
}
.antiProxyIp-tail {
  display: flex;
  height: 32px;
  align-items: center;
  line-height: 16px !important;
}
.el-dialog ._safe-log .el-form-item {
  margin-bottom: 22px;
}
.el-dialog ._safe-cc {
  margin-bottom: 16px;
}
</style>

<style>
.el-dropdown-ip {
  min-width: 85px;
}
.el-dropdown-link {
  cursor: pointer;
  margin-right: 10px;
}
.iptype-out {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.iptype-choose {
  width: 170px;
  margin-bottom: 0 !important;
}
.iptype-choose .el-form-item__content {
  margin-left: 0 !important;
}
.header-right .el-dialog__close.el-icon.el-icon-close {
  cursor: pointer;
  padding: 10px;
}
.edit .el-form-item__content {
  min-height: 32px;
  display: flex;
  align-items: center;
}
.site .log-statistics .el-input__icon,
.site .log-statistics .el-input__prefix,
.site .log-statistics .el-input__inner,
.site .log-statistics .el-input--suffix .el-date-editor--datetime,
.site .log-statistics .el-range-separator {
  height: 28px;
  line-height: 28px;
}

.site .site-tab .el-tabs__nav {
  display: flex;
  display: -webkit-flex;
  width: 100%;
}

.site .site-tab .el-tabs__item {
  flex: 1;
  background: #f7f7f7;
}

.site .site-tab .el-tabs__item.is-active {
  background: #fff;
}

.site .add-ips-btn .el-form-item__content {
  margin-left: 0 !important;
}

.site .el-dialog .el-form-item.check > div {
  margin-left: 60px !important;
}

.site .site .ip-select .el-input__inner {
  width: 100% !important;
}

.site .el-button.el-button--primary.el-button--small {
  height: 32px;
}

.site .cache-time .el-input .el-input__inner {
  width: 170px;
}

.site .reserve .el-input__inner,
.site .reserve .el-input .el-input--suffix {
  background-color: #fff !important;
}

/* 编辑弹出框 头部 第二级导航 */
.site .edit .el-tabs__item.is-top {
  width: 156px;
  text-align: center;
  border: none;
}

/* 多选框 */
.site .el-dialog .el-textarea__inner {
  width: 440px;
  height: 120px;
  padding: 10px 20px;
}

/* tab 内边距清0 */
.site .el-dialog .el-tabs--border-card > .el-tabs__content {
  padding: 0px;
}

.site .add .el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
}
</style>
