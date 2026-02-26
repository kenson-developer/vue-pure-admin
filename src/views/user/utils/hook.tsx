import { getUserList } from "@/api/user";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { onMounted, reactive, ref, type Ref } from "vue";

export function useUser(tableRef: Ref) {
  const form = reactive({
    username: "",
    mobile: "",
    page: 1,
    limit: 10,
    sort: "created_at",
    order: "desc"
  });
  const dataList = ref([]);
  const loading = ref(true);
  const selectNum = ref(0);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "序号",
      prop: "id",
      minWidth: 90
    },
    {
      label: "用户名",
      prop: "username",
      minWidth: 100
    },
    {
      label: "用户昵称",
      prop: "nickname",
      minWidth: 100
    },
    {
      label: "手机号",
      prop: "mobile",
      minWidth: 100
    },
    {
      label: "性别",
      prop: "gender",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.gender === 2 ? "danger" : null}
          effect="plain"
        >
          {row.gender === 0 ? "未知" : row.gender === 2 ? "女" : "男"}
        </el-tag>
      )
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 0 ? "danger" : null}
          effect="plain"
        >
          {row.status === 0 ? "禁用" : "启用"}
        </el-tag>
      )
    }
  ];

  function handleSizeChange(val: number) {
    form.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.page = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    selectNum.value = val.length;
    tableRef.value.setAdaptive();
  }

  async function onSearch() {
    loading.value = true;
    const { errno, data } = await getUserList(form);
    if (errno === 0) {
      dataList.value = data.list;
      pagination.total = data.total;
      pagination.pageSize = data.limit;
      pagination.currentPage = data.page;
    }

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    deviceDetection,
    onSearch,
    resetForm,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange
  };
}
