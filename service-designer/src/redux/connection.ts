import { connect } from "react-redux";
import { withRouter } from "react-router";

export const connectRouter:any = (mapStateToProps:any, mapDispatchToProps:any, compnent:any) => {
  const conn:any = connect(mapStateToProps, mapDispatchToProps)(compnent)
  return withRouter(conn);
}
