import styles from './index.css'
import React, {Component} from 'react'

import { connect } from 'dva';
import { Table, message, Card, Button, Popconfirm, Tag, Badge, notification } from 'antd';
import { sleep } from '@utils/sleep'
import AddForm from './components/AddForm';

const mapStateToProps = (state, props) => {
  return {
    weiBoRecordList: state.captureDataModels.data.weiBoRecordList
  }
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    queryCaptureRecordAction: (that) => {
      const action = {
        type: 'captureDataModels/getWeiBoQueryRecord',
        callback: async(res) => {
          console.log(res);
          // await sleep(1800);
          // message.destroy();
          that.setState({
            tableLoading: false,
          });
          // if (res.status === 'success') {
          //   message.success(res.msg)
          // } else {
          //   message.error(res.msg)
          // }
        }
      };
      dispatch(action)
    },
    addCaptureDataAction: (form, propsForm, that) => {
      const action = {
        type: 'captureDataModels/getWeiBoCapture',
        payload: form,
        callback: async(res) => {
          console.log(res);
          await sleep(1800);
          message.destroy();
          // notification.info({
          //   message: res.msg,
          //   description: res.data.content,
          //   duration: 4.5
          // });
          that.setState({
            addFormLoading: false,
            addFormVisible: false
          });
          propsForm.resetFields();
          that.props.queryCaptureRecordAction(that);
          if (res.status === 'success') {
            message.success(res.msg);
          } else {
            message.error(res.msg)
          }
        }
      };
      dispatch(action)
    },
    deleteCaptureRecordAction: (form, that) => {
      const action = {
        type: 'captureDataModels/getWeiBoDeleteRecord',
        payload: form,
        callback: async(res) => {
          console.log(res);
          await sleep(1800);
          message.destroy();
          if (res.status === 'success') {
            message.success(res.msg);
            that.props.queryCaptureRecordAction(that)
          } else {
            message.error(res.msg)
          }
        }
      };
      dispatch(action)
    }
  }
};

@connect(mapStateToProps, mapDispatchToProps)
class CaptureData extends  Component{
  // ????????????
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '????????????',
          dataIndex: 'create_time',
          key: 'create_time',
        },
        {
          title: '????????????',
          dataIndex: 'update_time',
          key: 'update_time',
        },
        {
          title: '????????????',
          dataIndex: 'url',
          key: 'url',
          render: (text, record) => (
            <a>{text}</a>
          ),
        },
        {
          title: '??????????????????',
          dataIndex: 'userIdPrefix',
          key: 'userIdPrefix',
        },
        {
          title: '????????????',
          dataIndex: 'scopeStart',
          key: 'scopeStart',
        },
        {
          title: '????????????',
          dataIndex: 'scopeEnd',
          key: 'scopeEnd',
        },
        {
          title: '????????????',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => {
            switch (text) {
              case 0:
                return (<Badge status="processing" text="?????????" />);
              case 1:
                return (<Tag color="#87d068">??????</Tag>);
              case 2:
                return (<Tag color="#f50">??????</Tag>);
            }
          },
        },
        {
          title: '??????',
          key: 'action',
          render: (text, record) => (
            <span>
              <Popconfirm title={"?????????????????????????"} onConfirm={this.handleTableDelete.bind(this, record)}>
                <a>??????</a>
              </Popconfirm>
            </span>
          ),
        },
      ],
      tableLoading: true,
      addFormVisible: false,
      addFormLoading: false
    };
  }
  // ??????????????????
  componentWillMount() {
    // this.props.getUserInfo()
  }
  // ???????????????????????? DOM ????????????
  componentDidMount() {
    this.props.queryCaptureRecordAction(this)
  }
  // ????????????
  componentWillUnmount() {
  }
  // ????????????
  handleTableDelete(record) {
    console.log(record);
    message.loading('????????????', 0);
    let form = {
      id: record.id
    };
    this.props.deleteCaptureRecordAction(form, this);
  }
  // ????????????
  handleTableAdd = () => {
    this.setState({
      addFormVisible: true
    })
  };
  // ???????????????
  onCancel = () => {
    this.setState({
      addFormVisible: false
    })
  };
  onAddFormSubmit = (values, propsForm) => {
    this.setState({
      addFormLoading: true
    });
    console.log('onAddFormSubmit', values);
    message.loading('????????????', 0);
    this.props.addCaptureDataAction(values, propsForm, this)
  };
  render() {
    const {columns, tableLoading} = this.state;
    const {weiBoRecordList} = this.props;
    return (
      <div style={{ background: '#fff'}}>
        <Card title="????????????" bordered={false}>
          <div style={{marginBottom: 12}}>
            <Button type="primary" icon="plus" onClick={this.handleTableAdd}>
              ????????????
            </Button>
          </div>
          <Table dataSource={weiBoRecordList} columns={columns} loading={tableLoading} />
        </Card>
        <AddForm
          handleSubmit={this.onAddFormSubmit}
          handleCancel={this.onCancel}
          visible={this.state.addFormVisible}
          loading={this.state.addFormLoading}
        ></AddForm>
      </div>
    );
  };
}
export default CaptureData
