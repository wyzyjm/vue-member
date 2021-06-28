import { payResult } from "@/api/pay";
export async function getResult(orderId) {
  let param = {}
  param.orderId = orderId;
  let status;
  await payResult(param).then((res) => {
    if (res.status === 200) {
      status = res.data.isSuccess;
    } else {
      console.log("请求结果出问题了！")
    }
  })

  return status;

  

}
// export  getResult;