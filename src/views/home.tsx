import React, { CSSProperties } from 'react';
import PubsubService from '../service/pubsub.service'
import CodeSandbox from 'react-code-sandbox'
import ReactStrapService from '../service/reactstrap.service'
import { DataManager } from '../manager/data.manager'
import { CssManager } from '../manager/css.manager';
import { MainController } from '../controllers/main.controller';
import { IProps } from '../utils/interface';
import { Platform } from '../utils/constant';

export default class Home extends React.Component<IProps> {

    // state:any = {
    //     imports: [{library: ReactStrapService, items: ['Container']}],
    //     code: '<Container></Container>'
    // }

    // dataManager:DataManager;
    // cssManager:CssManager
    mainCtrl: MainController;

    constructor(props:IProps) {
        super(props);
        this.mainCtrl = MainController.getInstance(MainController);
    //     this.dataManager = DataManager.getInstance(DataManager);
    //     this.cssManager = CssManager.getInstance(CssManager);
    }

    componentWillMount() {
        if (!this.mainCtrl.isInitialized()) {
            if(this.props.history) this.props.history.push('/');
            return;
        }
    //     if (!this.dataManager.projectType) {
    //         this.props.history.push('/');
    //         return;
    //     }
    //     const style = document.createElement('style');
    //     document.head.appendChild(style);
    //     PubsubService.sub(PubsubService.KEY_RELOAD_HOME).subscribe((value:any)=> {
    //         this.setState(this.dataManager.render());
    //         style.innerHTML = this.cssManager.getCssFile();
    //     });
    }

    componentDidMount() {
        this.mainCtrl.home$.subscribe(()=> this.setState({}));
    }

    render() {
        // this.state.imports.forEach((lib:any)=> {
        //     if (lib.libname && lib.libname.indexOf('react-icons') !== -1) {
        //         const font_group = lib.libname.split('/')[1];
        //         imp[lib.items[0]] = DataManager.libTable['react-icons'].lib[font_group][lib.items[0]]
        //     } else if (lib.libname && lib.libname.indexOf('react-native-vector-icons') !== -1) {

        //     } else {
        //         lib.items.forEach((item:any)=> {
        //             imp[item] = lib.library.get(item)
        //         })
        //     }
        // })
        const data = this.mainCtrl.getRenderData();
        return <div id="design">
            { this.mainCtrl.getPlatform() === Platform.ReactNative && <img style={{height:'100vh'}} src="/frame.jpg" /> }
            <div style={(this.mainCtrl.getPlatform() === Platform.ReactNative) ? styles.mobile : {}}>
                <CodeSandbox imports={data.imp}>
                {'state='+JSON.stringify(data.state)+';renderPart=(name)=>{};render(' +data.code + ')'}
                </CodeSandbox>
            </div>
        </div>
    }
}

const styles:{[s: string]: CSSProperties;} = {
    mobile: {
        width: '42.5vh',
        position: 'absolute',
        top: '12%',
        bottom: '12.5%',
        left: '3vh',
        overflow: 'auto'
    }
}