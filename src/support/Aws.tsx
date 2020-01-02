import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from 'reactstrap';
import { BehaviorSubject } from 'rxjs';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import * as resourceActions from '../resource/Resource.actions';
import * as supportActions from './Support.actions';

declare var window;

const AWS = window.require('aws-sdk');
export const subject = new BehaviorSubject(false);
export const isAwsVaild = async(config) => {
    return new Promise((resolve, reject)=> {
        if (config.accessKeyId) {
            AWS.config.update({
                accessKeyId:config.accessKeyId,
                secretAccessKey:config.secretAccessKey,
                region: config.region
            })
            const s3  = new AWS.S3()
            s3.listObjects({
                Bucket: config.bucket
            }, (err, data)=> {
                if (err) {
                    reject()
                } else {
                    resolve()
                }
            })
        } else {
            reject()
        }
    })
}
export const S3upload = async(bucket,region, name, value) => new Promise(resolve=> {
    const s3 = new AWS.S3()
    const base64Data = window.Buffer.from(value.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    // const type = value.split(';')[0].split('/')[1];
    const key = 'designer/'+name+'.png'
    const payload = {
        Bucket: bucket,
        Key: key,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: 'image/png'
    }
    s3.putObject(payload, (err, res)=> {
        if (res) {
            const url = 'https://'+bucket+'.s3.'+region+'.'+'amazonaws.com/'+ key
            resolve(url)
        }
    })
})

export const S3remove = async(bucket, name) => new Promise(resolve=> {
    const s3 = new AWS.S3()
    s3.deleteObject({
        Bucket: bucket,
        Key: 'designer/'+name+'.png',
    },(err, res)=> resolve(res)) 
})

class SupportAws extends React.Component<any> {
    
    sub;

    state = {
        isOpen:false,
        synchornizing:false,
    
        awsAccessKeyId:'',
        awsSecretAccessKey:'',
        awsRegion:'',
        awsBucket:''
    }
    s3;

    UNSAFE_componentWillMount() {
        this.sub = subject.subscribe(val=> {
            if (val) {
                this.trigger()
            }
        })
    }

    componentWillUnmount() {
        this.sub.unsubscribe()
    }

    render() {
        return <div>
            <Modal isOpen={this.state.isOpen}>
                <ModalHeader toggle={()=>this.setState({isOpen:false})}>Connect Aws S3</ModalHeader>
                <ModalBody>
                    The assets will be uploaded to S3. <br /><br />
                    {this.state.synchornizing ? <div style={{textAlign:'center'}}>
                            <Spinner color="primary" />
                        </div> : [
                        <Input placeholder="AWS ACCESS KEY ID" value={this.state.awsAccessKeyId} onChange={(e)=>{
                            this.setState({awsAccessKeyId:e.target.value})
                        }} key={0}/>,
                        <Input placeholder="AWS SECRET ACCESS KEY" value={this.state.awsSecretAccessKey} onChange={(e)=>{
                            this.setState({awsSecretAccessKey:e.target.value})
                        }} key={1}/>,
                        <Input placeholder="AWS REGION" value={this.state.awsRegion} onChange={(e)=>{
                            this.setState({awsRegion:e.target.value})
                        }} key={2}/>,
                        <Input placeholder="AWS BUCKET" value={this.state.awsBucket} onChange={(e)=>{
                            this.setState({awsBucket:e.target.value})
                        }} key={3}/>
                    ]}
                </ModalBody>
                <ModalFooter>
                    {!this.state.synchornizing && <div>
                        <Button color="danger" onClick={()=>this.delete()}>Delete</Button>{' '}
                        <Button color="primary" onClick={()=>this.confirm()}>Confirm</Button>{' '}
                        <Button color="secondary" onClick={()=>this.setState({isOpen:false})}>Cancel</Button>
                    </div>}
                </ModalFooter>
            </Modal>
        </div>
    }

    trigger() {
        const {data}=this.props
        const state = {
            awsAccessKeyId     : data.support.aws.accessKeyId,
            awsSecretAccessKey : data.support.aws.secretAccessKey,
            awsRegion          : data.support.aws.region,
            awsBucket          : data.support.aws.bucket,
            isOpen             : true
        }
        this.setState(state)
    }

    confirm() {
        AWS.config.update({
            accessKeyId:this.state.awsAccessKeyId,
            secretAccessKey:this.state.awsSecretAccessKey,
            region: this.state.awsRegion
        })
        this.s3  = new AWS.S3()
        this.s3.listObjects({
            Bucket: this.state.awsBucket
        }, (err, data)=> {
            if (err) {
                alert('Authentication fail')
            } else {
                const {SupportActions} = this.props;
                SupportActions.setAwsConfig({
                    isConnected:true,
                    accessKeyId:this.state.awsAccessKeyId,
                    secretAccessKey:this.state.awsSecretAccessKey,
                    region:this.state.awsRegion,
                    bucket:this.state.awsBucket
                })
                this.sync()
            }
        })
        this.setState({isOpen:false})
    }

    async putObject(payload, callback) {
        return new Promise((resolve, reject)=> {
            this.s3.putObject(payload, (err, res)=> {
                callback(err, res)
                resolve()
            })
        })
    }

    async sync() {
        this.setState({
            isOpen:true,
            synchornizing:true
        })
        const {data, ResourceActions} = this.props;
        for(let i=0; i<data.resource.asset.length; i++) {
            const item = data.resource.asset[i]
            if (item.value.indexOf('data:image/') === 0) {
                const base64Data = window.Buffer.from(item.value.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                const type = item.value.split(';')[0].split('/')[1];
                const key = 'designer/'+item.name+'.'+type
                const payload = {
                    Bucket: this.state.awsBucket,
                    Key: key,
                    Body: base64Data,
                    ACL: 'public-read',
                    ContentEncoding: 'base64',
                    ContentType: 'image/'+type
                }
                await this.putObject(payload, (err, res)=> {
                    console.log(err, res)
                    if (res) {
                        const url = 'https://'+this.state.awsBucket+'.s3.'+this.state.awsRegion+'.'+'amazonaws.com/'+ key
                        ResourceActions.updateAsset({
                            name:item.name, 
                            value:url
                        })
                    }
                })
            }
        }
        this.setState({
            isOpen:false,
            synchornizing:false
        })
    }

    delete() {
        const {SupportActions} = this.props;
        SupportActions.setAwsConfig({
            isConnected:false,
            accessKeyId:undefined,
            secretAccessKey:undefined,
            region:undefined,
            bucket:undefined
        })
    }
}

export default connectRouter(
    (state)=> ({
        data: {
            resource: state.resource,
            support: state.support
        }
    }),
    (dispatch)=> ({
        ResourceActions: bindActionCreators(resourceActions, dispatch),
        SupportActions: bindActionCreators(supportActions, dispatch)
    }),
    SupportAws
)