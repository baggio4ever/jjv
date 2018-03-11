import { Injectable } from '@angular/core';
import * as vkbeautify from 'vkbeautify';
import { Guid } from "guid-typescript";


@Injectable()
export class Cip4Service {

  constructor() { }

  isJDF(filename: string): boolean {
    if ( filename.toLowerCase().endsWith('.jdf') ) {
      return true;
    } else {
      return false;
    }
  }

  isJMF(filename: string): boolean {
    if ( filename.toLowerCase().endsWith('.jmf') ) {
      return true;
    } else {
      return false;
    }
  }

  buildJDF( c: string ): JDF {
    let jdf = new JDF();

    const xml = vkbeautify.xml( c );
  
    if ( true ) {
      const parser = new DOMParser();
      const dom = parser.parseFromString( c, 'text/xml');

      // 初期化
      jdf.clear();
  
      // ResourcePool
      const resourcePoolTags = dom.getElementsByTagName('ResourcePool');
      if ( resourcePoolTags.length !== 1 ) {
        console.log('げ！ resourcePoolTag.length:'+resourcePoolTags.length);
      }
      const resourcePool = resourcePoolTags[0];
  
      // Componentタグ
      const componentTags = resourcePool.getElementsByTagName('Component');
      console.log('componentTags.length: ' + componentTags.length);
      for (let i = 0; i < componentTags.length; ++i ) {
        const j = componentTags[i];
        // ResourcePool 直下か
        if( j.parentElement === resourcePool ) {
          const id = j.getAttribute('ID');
          const componentType = j.getAttribute('ComponentType');
          const klass = j.getAttribute('Class');
          const dimensions = j.getAttribute('Dimensions');
          const body = vkbeautify.xml( j.outerHTML.toString() );
  
          const componentTag = new ComponentTag( id, componentType, klass, dimensions, body );
          jdf.pushComponentTag( componentTag );
        } else {
          console.log('はずれ！');
        }
      }
  
      // Deviceタグ
      const deviceTags = dom.getElementsByTagName('Device');
      console.log('deviceTags.length: ' + deviceTags.length);
      for (let i = 0; i < deviceTags.length; ++i ) {
        const j = deviceTags[i];
        const id = j.getAttribute('ID');
        const klass = j.getAttribute('Class');
        const deviceId = j.getAttribute('DeviceID');
        const friendlyName = j.getAttribute('FriendlyName');
        const body = vkbeautify.xml( j.outerHTML.toString() );
  
        const deviceTag = new DeviceTag( id, klass, deviceId, friendlyName, body );
        jdf.pushDeviceTag( deviceTag );
      }
  
      // StitchingParamsタグ
      const stitchingParamsTags = dom.getElementsByTagName('StitchingParams');
      console.log('stitchingParamsTags.length: ' + stitchingParamsTags.length);
      for (let i = 0; i < stitchingParamsTags.length; ++i ) {
        const j = stitchingParamsTags[i];
        const id = j.getAttribute('ID');
        const klass = j.getAttribute('Class');
        const numberOfStitches = j.getAttribute('NumberOfStitches');
        const stapleShape = j.getAttribute('StapleShape');
        const body = vkbeautify.xml( j.outerHTML.toString() );
  
        const stitchingParamsTag = new StitchingParamsTag( id, klass, numberOfStitches, stapleShape, body );
        jdf.pushStitchingParamsTag( stitchingParamsTag );
      }
  
      // TrimmingParamsタグ
      const trimmingParamsTags = dom.getElementsByTagName('TrimmingParams');
      console.log('trimmingParamsTags.length: ' + trimmingParamsTags.length);
      for (let i = 0; i < trimmingParamsTags.length; ++i ) {
        const j = trimmingParamsTags[i];
        const id = j.getAttribute('ID');
        const klass = j.getAttribute('Class');
        const noOp = j.getAttribute('NoOp');
        const trimmingType = j.getAttribute('TrimmingType');
        const height = j.getAttribute('Height');
        const width = j.getAttribute('Width');
        const trimmingOffset = j.getAttribute('TrimmingOffset');
        const body = vkbeautify.xml( j.outerHTML.toString() );
  
        const trimmingParamsTag = new TrimmingParamsTag( id, klass, noOp, trimmingType, width, height, trimmingOffset, body );
        jdf.pushTrimmingParamsTag( trimmingParamsTag );
      }
  
          // FoldingParamsタグ
          const foldingParamsTags = dom.getElementsByTagName('FoldingParams');
          console.log('foldingParamsTags.length: ' + foldingParamsTags.length);
          for (let i = 0; i < foldingParamsTags.length; ++i ) {
            const j = foldingParamsTags[i];
            const id = j.getAttribute('ID');
            const klass = j.getAttribute('Class');
            const descriptionType = j.getAttribute('DescriptionType');
            const foldCatalog = j.getAttribute('FoldCatalog');
            const folds: FoldTag[] = [];
  //          const body = j.outerHTML.toString();
            const body = vkbeautify.xml( j.outerHTML.toString() );
  
            const fBlocks = j.getElementsByTagName('Fold');
            for ( let ff = 0; ff < fBlocks.length; ++ ff ) {
              const x = fBlocks[ff];
              const x_to = x.getAttribute('To');
              const x_from = x.getAttribute('From');
              const x_travel = x.getAttribute('Travel');
              const ft = new FoldTag(x_to, x_from, x_travel);
              folds.push( ft );
            }
            const foldingParamsTag = new FoldingParamsTag( id, klass, descriptionType, foldCatalog, folds, body );
            jdf.pushFoldingParamsTag( foldingParamsTag );
/*            this.foldingParamsTags.push( foldingParamsTag );
          */          }
  
          // CuttingParamsタグ
          const cuttingParamsTags = dom.getElementsByTagName('CuttingParams');
          console.log('cuttingParamsTags.length: ' + cuttingParamsTags.length);
          for (let i = 0; i < cuttingParamsTags.length; ++i ) {
            const j = cuttingParamsTags[i];
            const id = j.getAttribute('ID');
            const klass = j.getAttribute('Class');
            const cutBlocks: CutBlockTag[] = [];
            const body = vkbeautify.xml( j.outerHTML.toString() );
  
            const cBlocks = j.getElementsByTagName('CutBlock');
            for ( let cc = 0; cc < cBlocks.length; ++ cc ) {
              const x = cBlocks[cc];
              const x_id = x.getAttribute('ID');
              const x_class = x.getAttribute('Class');
              const x_blockType = x.getAttribute('BlockType');
              const x_blockName = x.getAttribute('BlockName');
              const X_blockSize = x.getAttribute('BlockSize');
              const x_blockTrf = x.getAttribute('BlockTrf');
              const cbt = new CutBlockTag(x_id, x_class, x_blockType, x_blockName, X_blockSize, x_blockTrf,
                   vkbeautify.xml(x.outerHTML.toString()));
              cutBlocks.push(cbt);
            }
  
            const cuttingParamsTag = new CuttingParamsTag( id, klass, cutBlocks, body );
            jdf.pushCuttingParamsTag(cuttingParamsTag);
/*            this.cuttingParamsTags.push( cuttingParamsTag );
          */        }
  
          // CoverApplicationParamsタグ
          const coverApplicationParamsTags = dom.getElementsByTagName('CoverApplicationParams');
          console.log('coverApplicationParamsTags.length: ' + coverApplicationParamsTags.length);
          for (let i = 0; i < coverApplicationParamsTags.length; ++i ) {
            const j = coverApplicationParamsTags[i];
            const id = j.getAttribute('ID');
            const klass = j.getAttribute('Class');
            const noOp = j.getAttribute('NoOp');
            const body = vkbeautify.xml( j.outerHTML.toString() );
  
            const coverApplicationParamsTag = new CoverApplicationParamsTag( id, klass, noOp, body );
            jdf.pushCoverApplicationParamsTag(coverApplicationParamsTag);
/*            this.coverApplicationParamsTags.push( coverApplicationParamsTag );
          */        }
  
          // SpinePreparationParamsタグ
          const spinePreparationParamsTags = dom.getElementsByTagName('SpinePreparationParams');
          console.log('spinePreparationParamsTags.length: ' + spinePreparationParamsTags.length);
          for (let i = 0; i < spinePreparationParamsTags.length; ++i ) {
            const j = spinePreparationParamsTags[i];
            const id = j.getAttribute('ID');
            const klass = j.getAttribute('Class');
            const millingDepth = j.getAttribute('MillingDepth');
            const body = vkbeautify.xml( j.outerHTML.toString() );
  
            const spinePreparationParamsTag = new SpinePreparationParamsTag( id, klass, millingDepth, body );
            jdf.pushSpinePreparationParamsTag( spinePreparationParamsTag);
/*            this.spinePreparationParamsTags.push( spinePreparationParamsTag );
          */        }
  
          // StackingParamsタグ
          const stackingParamsTags = dom.getElementsByTagName('StackingParams');
          console.log('stackingParamsTags.length: ' + stackingParamsTags.length);
          for (let i = 0; i < stackingParamsTags.length; ++i ) {
            const j = stackingParamsTags[i];
            // ResourcePool 直下か
            if( j.parentElement === resourcePool ) {
              const id = j.getAttribute('ID');
              const klass = j.getAttribute('Class');
              const standardAmount = j.getAttribute('StandardAmount');
              const layerAmount = j.getAttribute('LayerAmount');
              const body = vkbeautify.xml( j.outerHTML.toString() );
    
              const stackingParamsTag = new StackingParamsTag( id, klass, standardAmount, layerAmount, body );
              jdf.pushStackingParamsTag( stackingParamsTag );
            }
/*            this.stackingParamsTags.push( stackingParamsTag );
          */        
         }
  
          // JDFタグ  最後が良い、多分。参照したいデータが揃っているはずなので
          const jdfTags = dom.getElementsByTagName('JDF');
          console.log('jdfTags.length: ' + jdfTags.length);
          for (let i = 0; i < jdfTags.length; ++i ) {
            const j = jdfTags[i];
            const id = j.getAttribute('ID');
            const type = j.getAttribute('Type');
            const dn = j.getAttribute('DescriptiveName');
            const jobId = j.getAttribute('JobID');
            const jobPartId = j.getAttribute('JobPartID');
            const body = vkbeautify.xml( j.outerHTML.toString() );
  //          const body = j.outerHTML.toString();
  
            const inputComponentLinks: ComponentLinkTag[] = [];
            const outputComponentLinks: ComponentLinkTag[] = [];
            const paramsLinks: LinkTag[] = [];
            const deviceLinks: LinkTag[] = [];
            const linkPools = j.getElementsByTagName('ResourceLinkPool');
            if ( linkPools.length === 1) {
              for ( let k = 0; k < linkPools[0].children.length; k++ ) {
                const comp = linkPools[0].children[k];
                let usage = '';
                let rRef = '';
                let amount = '';
                switch ( comp.tagName ) {
                  case 'ComponentLink':
                    usage = comp.getAttribute('Usage');
                    rRef = comp.getAttribute('rRef');
                    amount = comp.getAttribute('Amount');
                    const cl = new ComponentLinkTag(usage, rRef, amount);
                    if ( usage.toLowerCase() === 'input' ) {
                      inputComponentLinks.push(cl);
                    } else {
                      outputComponentLinks.push(cl)
                    }
                    break;
                  case 'SpinePreparationParamsLink':
                    usage = comp.getAttribute('Usage');
                    rRef = comp.getAttribute('rRef');
                    amount = comp.getAttribute('Amount');
                    const sppl = new SpinePrearationParamsLinkTag( usage, rRef, amount );
                    paramsLinks.push(sppl);
                    break;
                  case 'CoverApplicationParamsLink':
                    usage = comp.getAttribute('Usage');
                    rRef = comp.getAttribute('rRef');
                    const capl = new CoverApplicationParamsLinkTag( usage, rRef, amount );
                    paramsLinks.push(capl);
                    break;
                  case 'StitchingParamsLink':
                    usage = comp.getAttribute('Usage');
                    rRef = comp.getAttribute('rRef');
                    const spl = new StitchingParamsLinkTag( usage, rRef, amount );
                    paramsLinks.push(spl);
                    break;
                  case 'TrimmingParamsLink':
                    usage = comp.getAttribute('Usage');
                    rRef = comp.getAttribute('rRef');
                    const tpl = new TrimmingParamsLinkTag( usage, rRef, amount );
                    paramsLinks.push(tpl);
                    break;
                  case 'CuttingParamsLink':
                    usage = comp.getAttribute('Usage');
                    rRef = comp.getAttribute('rRef');
                    const cpl = new CuttingParamsLinkTag( usage, rRef, amount );
                    paramsLinks.push(cpl);
                    break;
                  case 'FoldingParamsLink':
                    usage = comp.getAttribute('Usage');
                    rRef = comp.getAttribute('rRef');
                    const fpl = new FoldingParamsLinkTag( usage, rRef, amount );
                    paramsLinks.push(fpl);
                    break;
                  case 'DeviceLink':
                    usage = comp.getAttribute('Usage');
                    rRef = comp.getAttribute('rRef');
                    const dl = new DeviceLinkTag( usage, rRef, amount );
                    deviceLinks.push(dl);
                    break;
                  case 'StackingParamsLink':
                    usage = comp.getAttribute('Usage');
                    rRef = comp.getAttribute('rRef');
                    const spl2 = new StackingParamsLinkTag( usage, rRef, amount );
                    paramsLinks.push(spl2);
                    break;
                  default:
                    console.log('default キター: ' + comp.tagName);
                    break;
                }
              }
            }
            const jdfTag = new JdfTag( id, type, dn, jobId, jobPartId,
                inputComponentLinks, outputComponentLinks, paramsLinks, deviceLinks, body );
            if ( j.parentElement === null /* type === 'ProcessGroup'*/ ) {
              jdf.jobTag = jdfTag;
            } else {
              jdf.pushProcessTag(jdfTag);
/*              this.processTags.push( jdfTag );
            */          }
          }
        }
        return jdf;
  }

  parseJDF(file): Promise<JDF> {
    return new Promise( resolve => {
      const fileName: string = file.name;
      const reader = new FileReader();

      console.log(file);
      console.log( 'typeof(file.name):' + typeof(file.name));

      reader.onload = (e) => {
        const c = reader.result;
        resolve( this.buildJDF(c) );
      };
      reader.readAsText(file);
    });
  }
}

export class JDF {
  jobTag: JdfTag = null;
  processTags: JdfTag[] = [];
  componentTags: ComponentTag[] = [];
  deviceTags: DeviceTag[] = [];
  stitchingParamsTags: StitchingParamsTag[] = [];
  trimmingParamsTags: TrimmingParamsTag[] = [];
  foldingParamsTags: FoldingParamsTag[] = [];
  cuttingParamsTags: CuttingParamsTag[] = [];
  coverApplicationParamsTags: CoverApplicationParamsTag[] = [];
  spinePreparationParamsTags: SpinePreparationParamsTag[] = [];
  stackingParamsTags: StackingParamsTag[] = [];

  clear(): void {
    this.jobTag = null;
    this.processTags = [];

    this.componentTags = [];

    this.deviceTags = [];

    this.stitchingParamsTags = [];
    this.trimmingParamsTags = [];
    this.foldingParamsTags = [];
    this.cuttingParamsTags = [];
    this.coverApplicationParamsTags = [];
    this.spinePreparationParamsTags = [];
    this.stackingParamsTags = [];
  }

  pushComponentTag( tag: ComponentTag ) {
    this.componentTags.push( tag );
  }

  pushDeviceTag( tag: DeviceTag ) {
    this.deviceTags.push( tag );
  }

  pushStitchingParamsTag( tag: StitchingParamsTag ) {
    this.stitchingParamsTags.push( tag );
  }

  pushTrimmingParamsTag( tag: TrimmingParamsTag ) {
    this.trimmingParamsTags.push( tag );
  }

  pushFoldingParamsTag( tag: FoldingParamsTag ) {
    this.foldingParamsTags.push( tag );
  }

  pushCuttingParamsTag( tag: CuttingParamsTag ) {
    this.cuttingParamsTags.push( tag );
  }

  pushCoverApplicationParamsTag( tag: CoverApplicationParamsTag ) {
    this.coverApplicationParamsTags.push( tag );
  }

  pushSpinePreparationParamsTag( tag: SpinePreparationParamsTag ) {
    this.spinePreparationParamsTags.push( tag );
  }

  pushStackingParamsTag( tag: StackingParamsTag ) {
    this.stackingParamsTags.push( tag );
  }

  pushProcessTag( tag: JdfTag ) {
    this.processTags.push( tag );
  }

  getComponentTagById( id: string ): ComponentTag {
    let ret: ComponentTag = null;
    for ( let i = 0; i < this.componentTags.length; i++ ) {
      const componentTag = this.componentTags[i];
      if (componentTag.id === id) {
        ret = componentTag;
        break;
      }
    }
    return ret;
  }

  getDeviceTagById( id: string ): DeviceTag {
    let ret: DeviceTag = null;
    for ( let i = 0; i < this.deviceTags.length; i++ ) {
      const deviceTag = this.deviceTags[i];
      if (deviceTag.id === id) {
        ret = deviceTag;
        break;
      }
    }
    return ret;
  }

  // うーん。いまいち。
  getParamsTagById( id: string ): IdHavingTag {
    let r;

    if ( r = this.coverApplicationParamsTags.find((v,i,a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.cuttingParamsTags.find((v,i,a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.foldingParamsTags.find((v,i,a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.stitchingParamsTags.find((v,i,a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.spinePreparationParamsTags.find((v,i,a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.trimmingParamsTags.find((v,i,a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.stackingParamsTags.find((v,i,a) => {return v.id===id;})) {
      return r;
    }

    return null;
  }
  
  // 引数で渡すコンポーネント（用紙とか）を作成した工程を返す
  getPreviousProcesses( component: ComponentTag ): JdfTag[] {
    let ret: JdfTag[] = [];

    ret = this.processTags.filter( (value,index,array) => {
      const r = value.outputComponentLinks.filter( (v,i,ary) => {
        return (v.rRef === component.id);
      });
      return (r.length > 0);
    });
    return ret;
  }

  // 引数で渡すコンポーネント（用紙とか）を使用する工程を返す
  getNextProcesses( component: ComponentTag ): JdfTag[] {
    let ret: JdfTag[] = [];

    ret = this.processTags.filter( (value,index,array) => {
      const r = value.inputComponentLinks.filter( (v,i,ary) => {
        return (v.rRef === component.id);
      });
      return (r.length > 0);
    });
    return ret;
  }

  // 引数で渡すデバイスを利用している工程を返す
  getProcessesUsingThisDevice( component: ComponentTag ): JdfTag[] {
    let ret: JdfTag[] = [];

    ret = this.processTags.filter( (value,index,array) => {
      const r = value.deviceLinks.filter( (v,i,ary) => {
        return (v.rRef === component.id);
      });
      return (r.length > 0);
    });
    return ret;
  }

  getProcessesUsingThisParams( component: ComponentTag ): JdfTag[] {
    let ret: JdfTag[] = [];

    ret = this.processTags.filter( (value,index,array) => {
      const r = value.paramsLinks.filter( (v,i,ary) => {
        return (v.rRef === component.id);
      });
      return (r.length > 0);
    });
    return ret;
  }

}

class BaseTag {
  guid: string; // Cytoscapeで使えないかしら

  constructor() {
    this.guid = Guid.create().toString();
  }
}

class IdHavingTag extends BaseTag {
  id: string;
  constructor(id: string){
    super();

    this.id = id;
  }
}

export class JdfTag extends IdHavingTag {
  type: string;
  body: string;
  descriptiveName: string;
  jobId: string;
  jobPartId: string;
  inputComponentLinks: ComponentLinkTag[] = [];
  outputComponentLinks: ComponentLinkTag[] = [];
  paramsLinks: LinkTag[] = [];
  deviceLinks: LinkTag[] = [];

  constructor(id: string, type: string, descriptiveName: string, jobId: string, jobPartId: string,
      inputComponentLinks: ComponentLinkTag[], outputComponentLinks: ComponentLinkTag[], paramsLinks: LinkTag[],
      deviceLinks: LinkTag[], body: string) {
    super(id);

    this.type = type;
    this.descriptiveName = descriptiveName;

    this.jobId = jobId;
    this.jobPartId = jobPartId;

    this.inputComponentLinks = inputComponentLinks;
    this.outputComponentLinks = outputComponentLinks;
    this.paramsLinks = paramsLinks;
    this.deviceLinks = deviceLinks;

    this.body = body;
  }
}

export class DeviceTag extends IdHavingTag {
  klass: string;
  deviceId: string;
  friendlyName: string;
  body: string;

  constructor(id: string, klass: string, deviceId: string, friendlyName: string, body: string) {
    super(id);

    this.klass = klass;
    this.deviceId = deviceId;
    this.friendlyName = friendlyName;

    this.body = body;
  }
}

export class ComponentTag extends IdHavingTag {
  componentType: string;
  klass: string;
  dimensions: string; // 幅、長さ、厚さ
  body: string;

  dimensions_width:number;
  dimensions_length:number;
  dimensions_thickness:number;

  constructor(id: string, componentType: string, klass: string, dimensions: string, body: string) {
    super(id);

    this.componentType = componentType;
    this.klass = klass;
    this.dimensions = dimensions;

    if( this.dimensions ) {
      const d = this.dimensions.split(' ');
      this.dimensions_width = JDFUtils.parseNumber(d[0]);
      this.dimensions_length = JDFUtils.parseNumber(d[1]);
      this.dimensions_thickness = JDFUtils.parseNumber(d[2]);
    }

    this.body = body;
  }

  getDimensionsWidth():number {
    return this.dimensions_width;
  }

  getDimensionsLength():number {
    return this.dimensions_length;
  }

  getDimensionsThickness():number {
    return this.dimensions_thickness;
  }

  getDimensionsWidth_mm():number {
    return JDFUtils.pt2mm( this.dimensions_width );
  }

  getDimensionsLength_mm():number {
    return JDFUtils.pt2mm( this.dimensions_length );
  }

  getDimensionsThickness_mm():number {
    return JDFUtils.pt2mm( this.dimensions_thickness );
  }
  
  getDimensions_mm(): string {
    return [this.dimensions_width,this.dimensions_length,this.dimensions_thickness]
          .map( (v,i,a) => {
            return JDFUtils.pt2mm( v );
          })
          .join(' ');
/*
    if (this.dimensions) {
    return this.dimensions
      .split(' ')
      .map( (v,i,a) => {
        return JDFUtils.pt2mm( JDFUtils.parseNumber(v) );
      })
      .join(' ');
    } else {
      return '記述なし';
    }
*/
  }
}

export class StitchingParamsTag extends IdHavingTag  {
  klass: string;
  numberOfStitches: string;
  stapleShape: string;
  body: string;

  constructor(id: string, klass: string, numberOfStitches: string, stapleShape: string, body: string) {
    super(id);

    this.klass = klass;
    this.numberOfStitches = numberOfStitches;
    this.stapleShape = stapleShape;

    this.body = body;
  }
}

export class TrimmingParamsTag  extends IdHavingTag {
  klass: string;
  noOp: string;
  trimmingType: string;
  height: string;
  width: string;
  trimmingOffset: string;
  body: string;

  constructor(id: string, klass: string, noOp: string, trimmingType: string,
       height: string, width: string, trimmingOffset: string, body: string) {
    super(id);

    this.klass = klass;
    this.noOp = noOp;
    this.trimmingType = trimmingType;
    this.height = height;
    this.width = width;
    this.trimmingOffset = trimmingOffset;

    this.body = body;
  }

  getWidth_mm(): number {
    return JDFUtils.pt2mm( JDFUtils.parseNumber(this.width) );
  }

  getHeight_mm(): number {
    return JDFUtils.pt2mm( JDFUtils.parseNumber(this.height) );
  }
}

export class FoldingParamsTag  extends IdHavingTag {
  klass: string;
  descriptionType: string;
  foldCatalog: string;
  folds: FoldTag[];
  body: string;

  constructor( id: string, klass: string, descriptionType: string, foldCatalog: string, folds: FoldTag[], body: string ) {
    super(id);

    this.klass = klass;
    this.descriptionType = descriptionType;
    this.foldCatalog = foldCatalog;
    this.folds = folds;

    this.body = body;
  }
}

export class FoldTag  extends BaseTag {
  to: string;
  from: string;
  travel: string;

  constructor( to: string, from: string, travel: string ) {
    super();

    this.to = to;
    this.from = from;
    this.travel = travel;
  }

  getTravel_mm(): number {
    return JDFUtils.pt2mm( JDFUtils.parseNumber( this.travel ) );
  }
}

export class CuttingParamsTag  extends IdHavingTag {
  klass: string;
  cutBlocks: CutBlockTag[];
  body: string;

  constructor( id: string, klass: string, cutBlocks: CutBlockTag[], body: string ) {
    super(id);

    this.klass = klass;
    this.cutBlocks = cutBlocks;

    this.body = body;
  }
}

export class CutBlockTag  extends IdHavingTag {
  klass: string;
  blockType: string;
  blockName: string;
  blockSize: string;
  blockTrf: string;
  body: string;

  constructor( id: string, klass: string, blockType: string, blockName: string, blockSize: string, blockTrf: string, body: string ) {
    super(id);

    this.klass = klass;
    this.blockType = blockType;
    this.blockName = blockName;
    this.blockSize = blockSize;
    this.blockTrf = blockTrf;

    this.body = body;
  }
}

export class CoverApplicationParamsTag  extends IdHavingTag {
  klass: string;
  noOp: string;
  body: string;

  constructor( id: string, klass: string, noOp: string, body: string ) {
    super(id);

    this.klass = klass;
    this.noOp = noOp;

    this.body = body;
  }
}

export class SpinePreparationParamsTag  extends IdHavingTag {
  klass: string;
  millingDepth: string;
  body: string;

  constructor( id: string, klass: string, millingDepth: string, body: string ) {
    super(id);

    this.klass = klass;
    this.millingDepth = millingDepth;

    this.body = body;
  }
}

export class StackingParamsTag  extends IdHavingTag {
  klass: string;
  standardAmount: string;
  layerAmount: string;
  body: string;

  constructor( id: string, klass: string, standardAmount: string,layerAmount: string, body: string ) {
    super(id);

    this.klass = klass;
    this.standardAmount = standardAmount;
    this.layerAmount = layerAmount;

    this.body = body;
  }
}

class LinkTag  extends BaseTag {
  usage: string;
  rRef: string;
  amount: string;

  constructor( usage: string, rRef: string, amount: string ) {
    super();

    this.usage = usage;
    this.rRef = rRef;
    this.amount = amount;
  }
}

class ComponentLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string ) {
    super( usage, rRef, amount );
  }
}

class CoverApplicationParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string ) {
    super( usage, rRef, amount );
  }
}

class SpinePrearationParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string ) {
    super( usage, rRef, amount );
  }
}

class StitchingParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string ) {
    super( usage, rRef, amount );
  }
}

class TrimmingParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string ) {
    super( usage, rRef, amount );
  }
}

class CuttingParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string ) {
    super( usage, rRef, amount );
  }
}

class FoldingParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string ) {
    super( usage, rRef, amount );
  }
}

class DeviceLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string ) {
    super( usage, rRef, amount );
  }
}

class StackingParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string ) {
    super( usage, rRef, amount );
  }
}



// JMF
class JMF {
  senderId: string;
  timeStamp: string;
  queryTags: QueryTag[] = [];
  body: string;

  constructor( senderId: string, timeStamp: string, queryTags: QueryTag[], body: string ) {
    this.senderId = senderId;
    this.timeStamp = timeStamp;
    this.queryTags = queryTags;

    this.body = body;
  }
}


class QueryTag  extends IdHavingTag {
  type: string;
  statusQuParamsTags: StatusQuParamsTag[] = [];
  body: string;

  constructor( id: string, type: string, statusQuParamsTags: StatusQuParamsTag[], body: string ) {
    super(id);

    this.type = type;
    this.statusQuParamsTags = statusQuParamsTags;

    this.body = body;
  }
}

class StatusQuParamsTag extends BaseTag {
  deviceDetails: string;
  body: string;

  constructor( deviceDetails: string, body: string ) {
    super();

    this.deviceDetails = deviceDetails;

    this.body = body;
  }
}

class SignalTag  extends IdHavingTag {
  type: string;
  deviceInfoTags: DeviceInfoTag[] = [];
  body: string;

  constructor( id: string, type: string, deviceInfoTags: DeviceInfoTag[], body: string ) {
    super(id);

    this.type = type;
    this.deviceInfoTags = deviceInfoTags;

    this.body = body;
  }
}

class DeviceInfoTag extends BaseTag {
  deviceStatus: string;
  deviceTag: DeviceTag;
  jobPhaseTags: JobPhaseTag[] = [];
  body: string;

  constructor( deviceStatus: string, deviceTag: DeviceTag, jobPhaseTags: JobPhaseTag[], body: string ) {
    super();

    this.deviceStatus = deviceStatus;
    this.deviceTag = deviceTag;
    this.jobPhaseTags = jobPhaseTags;

    this.body = body;
  }
}

/*
class DeviceTag {  <- JDFのやつと一緒なのかな
	klass: string;
	deviceId: string;
}
*/

class JobPhaseTag extends BaseTag  {
  status: string;
  jobPartId: string;
  jobId: string;
  startTime: string;
  totalAmount: string;
  amount: string;
  waste: string;
  body: string;

  constructor( status: string, jobParId: string, jobId: string, startTime: string,
       totalAmount: string, amount: string, waste: string, body: string ) {
    super();

    this.status = status;
    this.jobPartId = jobParId;
    this.jobId = jobId;
    this.startTime = startTime;
    this.totalAmount = totalAmount;
    this.amount = amount;
    this.waste = waste;

    this.body = body;
  }
}


export class JDFUtils {
  private constructor() {}

  static parseNumber( s: string ): number {
    return parseFloat(s);
  }

  static getWidth( dimensions: string ): string {
    return '';
  }
  static getLength( dimensions: string ): string {
    return '';
  }
  static getThickness( dimensions: string ): string {
    return '';
  }

  static pt2mm( v: number ): number {
    return this.inch2mm( this.pt2inch(v) );
  }

  static pt2inch( v: number ): number {
    return (v / 72.0);
  }

  static inch2pt( v: number ): number {
    return (v * 72.0);
  }

  static mm2inch( v: number ): number {
    return (v / 25.4);
  }

  static inch2mm( v: number ): number {
    return (v * 25.4);
  }
}
