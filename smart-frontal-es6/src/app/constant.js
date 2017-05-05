/*system interfaces url*/

/*
 *查询所有投放计划
 */
export const QUERY_CAMPAIGNPLAN = "/mc/campaignPlan/list";
/*
 *投放类型
 */
export const DELIVER_TYPE = '/dataDic/getDataDicList/publish_type';
/*
 *业务产品
 */
export const BUSINESS_PRODUCT = '/dataDic/getDataDicList/business_product';
/*
 *创建投放计划
 */
export const PLAN_CREATE = '/mc/campaignPlan/addCampaignPlan';
/*
 *更新投放计划
 */
export const PLAN_UPDATE = '/mc/campaignPlan/updateCampaignPlan';
/*
 *复制投放计划
 */
export const PLAN_COPY = '/mc/campaignPlan/copyCampaignPlan/';
/*
 *查询投放计划-基本信息
 */
export const SELECT_CAMPAIGNPLAN = '/mc/campaignPlan/selectCampaignPlan/';
/*
 *删除投放计划
 */
export const DEL_CAMPAIGNPLAN = '/mc/campaignPlan/delCampaignPlan/';
/*
 *查询所有投放动作
 */
export const GET_PUBLISHBYCAMPAIGNPLAN = '/mc/publish/getPublishsByCampaignIdPagination/';
export const GET_PUBLISH = '/mc/publish/getPublishsByCampaignId/';
/*
 *查询所有单渠道 适用于弹框中单渠道
 */
export const GET_ALL_REFFERAL = '/refferal/';
/*所有单渠道和代理商 适用于下拉搜索*/
export const GET_ALL_REFFERAL_AGENT = '/refferal/getRefferalAndAngentList';

/*添加投放动作*/
export const ADD_PUBLISH = '/mc/publish/insertPublishList';

/*编辑投放动作*/
export const UPD_PUBLISH = '/mc/publish/updatePublish';

/*删除投放动作*/
export const DEL_PUBLISH = '/mc/publish/delPublish/';

/*停止投放动作*/
export const STOP_PUBLISH = '/mc/publish/stopPublish/';

/*查询广告栏位*/
export const GET_BANNER_REFFERAL = '/banner/getBannersByRefferalIdAndPublishId';

/*查询所有素材任务*/
export const GET_MATERIAL_TASKLIST = '/materialTask/getMaterialTaskList/';

/*素材类型*/
export const DATA_DIC = '/materialTask/getDataDicList';

/*查询分配任务*/
export const GET_MATERIAL_TASK = '/materialTask/view/';

/*分配的用户*/
export const ALLOCATION_USER = '/materialTask/getUserList';

/*查询所有的附件*/
export const GET_ATTACH_MUL = '/attachment/getMultipleAttachments';

/*删除附件*/
export const DEL_ATTACH = '/attachment/deleteMultipleAttachments';

/*分配*/
export const ASSIGN_MATERIAL = '/materialTask/batchSave/';

/*上传*/
export const UPLOAD = '/attachment/push/';

/*下载*/
export const DOWNLOAD = '/attachment/fetch/';

/*导出投放URL列表*/
export const EXPORT_URL = "/mc/publish/export/";

/*验收完成*/
export const CHECK_COMPLETE = "/materialTask/complete/";
/**
 * target
 * */
export const TARGET = "/dataDic/getDataDicList/target";
/**
 * 渠道管理
 * */
/**获取渠道类型*/
export const GET_CHANNEL_TYPE = "/dataDic/getDataDicList/refferal_type";
/**
 * 获取部门
 * */
export const GET_DEPARTMENT = "/dataDic/getDataDicList/refferal_dept";
/**
 * 获取渠道列表
 * */
export const GET_CHANNEL_LIST = "/refferal/refferalList";
/**
 * 获取渠道状态
 * */
export const GET_CHANNEL_STATUS = "/dataDic/getDataDicList/refferal_state";
/**
 * 渠道导入模板地址
 * */
export const TEMPLATE_URL = "/refferal/template";
/**
 * 渠道导入地址
 * */
export const EXCEL_IMPORT_URL = "/refferal/excelImport";
/**
 * 开放接口
 * */
export const OPEN_API = "/dataDic/getDataDicList/refferal_port";
/**
 * 结算方式
 * */
export const SETTLE_MODE = "/dataDic/getDataDicList/refferal_payment";
/**
 * 产品接口
 * */
export const PRODUCT_API = "/product/getList";
/**
 * 获取单条渠道信息 -- id
 * */
export const VIEW_CHANNEL_BY_ID = "/refferal/view";
/**
 * 渠道保存
 * */
export const CHANNEL_SAVE = "/refferal/save";
/**
 * 渠道复制 --id
 * */
export const CHANNEL_COPY_BY_ID = "/refferal/copy";
/**
 * 渠道删除 --id
 * */
export const CHANNEL_DELETE_BY_ID = "/refferal/delete";
/**
 * 广告位
 * */
/**
 *获取广告位列表
 * */
export const GET_BANNER_BY_REFFERALID = "/banner/getBannersByRefferalId";
/**
 * 获取广告位类型
 * */
export const GET_BANNNER_TYPE = "/dataDic/getDataDicList/banner_type";
/**
 * 获取广告位置
 * */
export const GET_BANNNER_POSITION = "/dataDic/getDataDicList/banner_place";
/**
 * 获取单条广告位信息 --id
 * */
export const GET_BANNERINFO_BY_ID = "/banner/view";
/**
 * 保存广告位信息
 * */
export const BANNER_SAVE = "/banner/save";
/**
 * 广告位模板下载
 * */
export const AD_TEMPLATE_DOWNLOAD = "/banner/template";
/**
 * 广告位模板上传
 * */
export const AD_TEMPLATE_UPLOAD = "/banner/template/upload";
/**
 * 广告位导入
 * */
export const AD_EXCEL_IMPORT_URL = "/banner/excelImport";

/**素材管理*/
/**
 * 获取素材状态
 * */
export const GET_MATERIAL_STATUS = "/materialTask/getDataDicList";
/**
 * 获取素材列表
 * */
export const GET_MATERIAL_LIST = "/materialTask/selectMaterialTaskList";
/**
 * 获取单条素材task信息
 * */
export const GET_MATERIAL_TASK_BY_ID = "/materialTask/selectMaterialTask";
/**
 * 接受任务
 * */
export const ACCEPT_TASK = "/materialTask/updateTaskStatu";
/**
 * 获取素材管理列表
 * */
export const GET_MATERIAL_MANAGE_LIST = "/attachment/getMaterialList";
/**
 * 获取历史记录
 * */
export const GET_OPERATE_HISTORY = "/attachment/history/list/";
/**
 * 素材列表--删除素材
 * */
export const DELETE_MATERIAL = "/attachment/deleteMaterial";
/**
 * 邮件通知接口
 * */
export const NOTICE_EMAIL = "/email/custome";
/*字典数据*/
export const GET_DATA_DIC = "/dataDic/getDataDicList/";
/*主数据分页列表*/
export const MAIN_DATA_PAGINATION = "/dataDic/getMainDataListByPagination";
/*子数据添加*/
export const ADD_SUB_DATA = "/dataDic/insert";
/*子数据更新*/
export const UPDATE_SUB_DATA = "/dataDic/update";
/*子数据删除*/
export const DEL_SUB_DATA = "/dataDic/delete/";
/*数据CODE生成*/
export const GET_SUB_DATA_CODE = "/dataDic/getDataCode/";

/*代理商 for pagination*/
export const GET_AGENT_PANINATION = "/agent/getAgentList";
/*agent get*/
export const GET_AGENT_ALL = "/agent/getall";
/*agent save*/
export const SAVE_AGENT = "/agent/save";
/*agent load*/
export const GET_AGENT = "/agent/view/";
/*add agent channel*/
export const ADD_AGENT_CHANNEL = "/agent/saveAgentRefferal/";
/*get agent channel by pagination*/
export const GET_AGENT_CHANNEL = "/agent/getAgentRefferal";
/*remove agent channel by id*/
export const DEL_AGENT_CHANNEL = "/agent/deleteAgentRefferal/";
/*query channel by agent*/
export const GET_CHNNEL_BY_AGENT = "/refferal/getRefferalByAgentId/";


export const GET_DASHBOARD_OVERVIEW = "/dashboard/overViewData";
export const GET_CURRENT_DATA = "/dashboard/currentTimeMillis";
export const GET_CHANNEL_BYTYPE = "/dashboard/selectRefferalByDataType";
export const GET_DASHBOARD_CHAT1 = "/dashboard/selectRefferalCompare";
export const GET_DASHBOARD_CHAT2 = "/dashboard/selectRefferalTrend";
export const GET_DASHBOARD_CHAT3 = "/dashboard/selectRefferalConvertRatio";
export const GET_DASHBOARD_NOWCHAT3 = "/dashboard/selectRegRealTime";
// export const GET_DASHBOARD_DATADICLIST="/dataDic/getDataDicList/"
/*url可达性校验*/
export const CHECK_URL = "/mc/publish/checkUrlValid";

/**
 * 活动页相关接口
 * */
/*活动类型*/
export const GET_ACTIVITY_TYPE = "/dataDic/getDataDicList/active_type";
/*活动状态*/
export const GET_ACTIVITY_STATUS = "/dataDic/getDataDicList/active_status";
/*活动列表*/
export const GET_ACTIVITY_LIST = "/active/getActiveList";
/*保存、更新*/
export const SAVE_ACTIVITY = "/active/insertActive";
/*根据ID查询活动信息，例如：/active/selectActive/1000*/
export const GET_ACTIVITY_BY_ID = "/active/selectActive/";
/*更改发布状态*/
export const UPDATE_ACTIVITY_STATUS = "/active/updateActiveStatus";
/*根据ID删除活动，例如：http://ip:port/active/delActive/1000*/
export const DELETE_ACTIVITY_BY_ID = "/active/delActive/";
/*获取操作记录*/
export const GET_ACTIVITY_HISTORY_BY_ID = "/active/getActiveHisList/";
/*获取广告位URL*/
export const GET_ACTIVITY_URL_LIST = "/active/getActiveUrlListByUser";