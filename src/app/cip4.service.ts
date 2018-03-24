import { Injectable } from '@angular/core';
import * as vkbeautify from 'vkbeautify';
import { Guid } from 'guid-typescript';


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

  private createComponentTag(node): ComponentTag {
    const id = node.getAttribute('ID');
    const componentType = node.getAttribute('ComponentType');
    const klass = node.getAttribute('Class');
    const dimensions = node.getAttribute('Dimensions');
    const body = vkbeautify.xml( node.outerHTML.toString() );

    const componentTag = new ComponentTag( id, componentType, klass, dimensions, body );

    return componentTag;
  }

  private createDeviceTag(node): DeviceTag {
      const j = node;
      const id = j.getAttribute('ID');
      const klass = j.getAttribute('Class');
      const deviceId = j.getAttribute('DeviceID');
      const friendlyName = j.getAttribute('FriendlyName');
      const body = vkbeautify.xml( j.outerHTML.toString() );

      const deviceTag = new DeviceTag( id, klass, deviceId, friendlyName, body );

      return deviceTag;
  }

  private createStitchingParamsTag(node): StitchingParamsTag {
      const j = node;
      const id = j.getAttribute('ID');
      const klass = j.getAttribute('Class');
      const numberOfStitches = j.getAttribute('NumberOfStitches');
      const stapleShape = j.getAttribute('StapleShape');
      const body = vkbeautify.xml( j.outerHTML.toString() );

      const stitchingParamsTag = new StitchingParamsTag( id, klass, numberOfStitches, stapleShape, body );

      return stitchingParamsTag;
  }

  private createTrimmingParamsTag(node): TrimmingParamsTag {
      const j = node;
      const id = j.getAttribute('ID');
      const klass = j.getAttribute('Class');
      const noOp = j.getAttribute('NoOp');
      const trimmingType = j.getAttribute('TrimmingType');
      const height = j.getAttribute('Height');
      const width = j.getAttribute('Width');
      const trimmingOffset = j.getAttribute('TrimmingOffset');
      const body = vkbeautify.xml( j.outerHTML.toString() );

      const trimmingParamsTag = new TrimmingParamsTag( id, klass, noOp, trimmingType, width, height, trimmingOffset, body );

      return trimmingParamsTag;
  }

  private createFoldingParamsTag(node): FoldingParamsTag {
      const j = node;
      const id = j.getAttribute('ID');
      const klass = j.getAttribute('Class');
      const descriptionType = j.getAttribute('DescriptionType');
      const foldCatalog = j.getAttribute('FoldCatalog');
      const folds: FoldTag[] = [];

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

      return foldingParamsTag;
  }

  private createCuttingParamsTag(node): CuttingParamsTag {
    const j = node;
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
      const x_blockSize = x.getAttribute('BlockSize');
      const x_blockTrf = x.getAttribute('BlockTrf');
      const cbt = new CutBlockTag(x_id, x_class, x_blockType, x_blockName,
                        x_blockSize, x_blockTrf,
                        vkbeautify.xml(x.outerHTML.toString()));
      cutBlocks.push(cbt);
    }

    const cuttingParamsTag = new CuttingParamsTag( id, klass, cutBlocks, body );

    return cuttingParamsTag;
  }

  private createCoverApplicationParamsTag(node): CoverApplicationParamsTag {
    const j = node;
    const id = j.getAttribute('ID');
    const klass = j.getAttribute('Class');
    const noOp = j.getAttribute('NoOp');
    const body = vkbeautify.xml( j.outerHTML.toString() );

    const coverApplicationParamsTag = new CoverApplicationParamsTag( id, klass, noOp, body );

    return coverApplicationParamsTag;
  }

  private createSpinePreparationParamsTag(node): SpinePreparationParamsTag {
    const j = node;
    const id = j.getAttribute('ID');
    const klass = j.getAttribute('Class');
    const millingDepth = j.getAttribute('MillingDepth');
    const body = vkbeautify.xml( j.outerHTML.toString() );

    const spinePreparationParamsTag = new SpinePreparationParamsTag( id, klass, millingDepth, body );

    return spinePreparationParamsTag;
  }

  private createStackingParamsTag(node): StackingParamsTag {
    const id = node.getAttribute('ID');
    const klass = node.getAttribute('Class');
    const standardAmount = node.getAttribute('StandardAmount');
    const layerAmount = node.getAttribute('LayerAmount');
    const body = vkbeautify.xml( node.outerHTML.toString() );

    const stackingParamsTag = new StackingParamsTag( id, klass, standardAmount, layerAmount, body );

    return stackingParamsTag;
  }

  private createUnknownResourceTag(node): UnknownResourceTag {
    const body = vkbeautify.xml( node.outerHTML.toString() );
    const unknownResourceTag = new UnknownResourceTag( node.tagName, node.attributes, body );

    return unknownResourceTag;
  }

  private createComponentLinkTag(node, jdf: JDF): ComponentLinkTag {
    const usage = node.getAttribute('Usage');
    const rRef = node.getAttribute('rRef');
    const amount = node.getAttribute('Amount');

    const rResource = jdf.getResourceTagById(rRef);

    const linkTag = new ComponentLinkTag(usage, rRef, amount, rResource);

    return linkTag;
  }

  private createSpinePreparationParamsLinkTag(node, jdf: JDF): SpinePrearationParamsLinkTag {
    const usage = node.getAttribute('Usage');
    const rRef = node.getAttribute('rRef');
    const amount = node.getAttribute('Amount');

    const rResource = jdf.getResourceTagById(rRef);

    const linkTag = new SpinePrearationParamsLinkTag(usage, rRef, amount, rResource);

    return linkTag;
  }

  private createCoverApplicationParamsLinkTag(node, jdf: JDF): CoverApplicationParamsLinkTag {
    const usage = node.getAttribute('Usage');
    const rRef = node.getAttribute('rRef');

    const rResource = jdf.getResourceTagById(rRef);

    const linkTag = new CoverApplicationParamsLinkTag(usage, rRef, '', rResource);

    return linkTag;
  }

  private createStitchingParamsLinkTag(node, jdf: JDF): StitchingParamsLinkTag {
    const usage = node.getAttribute('Usage');
    const rRef = node.getAttribute('rRef');

    const rResource = jdf.getResourceTagById(rRef);

    const linkTag = new StitchingParamsLinkTag(usage, rRef, '', rResource);

    return linkTag;
  }

  private createTrimmingParamsLinkTag(node, jdf: JDF): TrimmingParamsLinkTag {
    const usage = node.getAttribute('Usage');
    const rRef = node.getAttribute('rRef');

    const rResource = jdf.getResourceTagById(rRef);

    const linkTag = new TrimmingParamsLinkTag(usage, rRef, '', rResource);

    return linkTag;
  }

  private createCuttingParamsLinkTag(node, jdf: JDF): CuttingParamsLinkTag {
    const usage = node.getAttribute('Usage');
    const rRef = node.getAttribute('rRef');

    const rResource = jdf.getResourceTagById(rRef);

    const linkTag = new CuttingParamsLinkTag(usage, rRef, '', rResource);

    return linkTag;
  }

  private createFoldingParamsLinkTag(node, jdf: JDF): FoldingParamsLinkTag {
    const usage = node.getAttribute('Usage');
    const rRef = node.getAttribute('rRef');

    const rResource = jdf.getResourceTagById(rRef);

    const linkTag = new FoldingParamsLinkTag(usage, rRef, '', rResource);

    return linkTag;
  }

  private createDeviceLinkTag(node, jdf: JDF): DeviceLinkTag {
    const usage = node.getAttribute('Usage');
    const rRef = node.getAttribute('rRef');

    const rResource = jdf.getResourceTagById(rRef);
// console.log( '*** ' + rRef + ' -> rResource:' + rResource);

    const linkTag = new DeviceLinkTag(usage, rRef, '', rResource);

    return linkTag;
  }

  private createStackingParamsLinkTag(node, jdf: JDF): StackingParamsLinkTag {
    const usage = node.getAttribute('Usage');
    const rRef = node.getAttribute('rRef');

    const rResource = jdf.getResourceTagById(rRef);

    const linkTag = new StackingParamsLinkTag(usage, rRef, '', rResource);

    return linkTag;
  }

  private createUnknownResourceLinkTag(node, jdf: JDF): UnknownResourceLinkTag {
    const rRef = node.getAttribute('rRef');
    const rResource = jdf.getResourceTagById(rRef);

    const linkTag = new UnknownResourceLinkTag( node.tagName, node.attributes, rResource);

    return linkTag;
  }

  private createJdfTag(node, jdf: JDF): JdfTag {
    const j = node;
    const id = j.getAttribute('ID');
    const type = j.getAttribute('Type');
    const dn = j.getAttribute('DescriptiveName');
    const jobId = j.getAttribute('JobID');
    const jobPartId = j.getAttribute('JobPartID');

    const body = vkbeautify.xml( j.outerHTML.toString() );

    const inputComponentLinks: ComponentLinkTag[] = [];
    const outputComponentLinks: ComponentLinkTag[] = [];
    const paramsLinks: LinkTag[] = [];
    const deviceLinks: LinkTag[] = [];

    const linkPools = j.getElementsByTagName('ResourceLinkPool');

    if ( linkPools.length === 1) {
      for ( let k = 0; k < linkPools[0].children.length; k++ ) {
        const comp = linkPools[0].children[k];

        switch ( comp.tagName ) {
          case 'ComponentLink':
            const cl = this.createComponentLinkTag(comp, jdf);
            if ( cl.usage.toLowerCase() === 'input' ) {
              inputComponentLinks.push(cl);
            } else {
              outputComponentLinks.push(cl);
            }
            break;
          case 'DeviceLink':
            const dl = this.createDeviceLinkTag(comp, jdf);
            deviceLinks.push(dl);
//            console.log(dl);
            break;
          case 'SpinePreparationParamsLink':
            const sppl = this.createSpinePreparationParamsLinkTag(comp, jdf);
            paramsLinks.push(sppl);
            break;
          case 'CoverApplicationParamsLink':
            const capl = this.createCoverApplicationParamsLinkTag(comp, jdf);
            paramsLinks.push(capl);
            break;
          case 'StitchingParamsLink':
            const spl = this.createStitchingParamsLinkTag(comp, jdf);
            paramsLinks.push(spl);
            break;
          case 'TrimmingParamsLink':
            const tpl = this.createTrimmingParamsLinkTag(comp, jdf);
            paramsLinks.push(tpl);
            break;
          case 'CuttingParamsLink':
            const cpl = this.createCuttingParamsLinkTag(comp, jdf);
            paramsLinks.push(cpl);
            break;
          case 'FoldingParamsLink':
            const fpl = this.createFoldingParamsLinkTag(comp, jdf);
            paramsLinks.push(fpl);
            break;
          case 'StackingParamsLink':
            const spl2 = this.createStackingParamsLinkTag(comp, jdf);
            paramsLinks.push(spl2);
            break;

          default:
            console.log('default キター: ' + comp.tagName);
            const unknown = this.createUnknownResourceLinkTag(comp, jdf);
            paramsLinks.push(unknown);
            break;
        }
      }
    }
    const jdfTag = new JdfTag(id, type, dn, jobId, jobPartId,
      inputComponentLinks, outputComponentLinks, paramsLinks, deviceLinks, body);

    return jdfTag;
  }

  buildJDF( c: string ): JDF {
    const jdf = new JDF();

    const xml = vkbeautify.xml( c );

    const parser = new DOMParser();
    const dom = parser.parseFromString( c, 'text/xml');

    // 初期化
    jdf.clear();
    jdf.beautifiedXml = xml;

    // ResourcePool
    const resourcePoolTags = dom.getElementsByTagName('ResourcePool');

    // ResourcePoolに含まれるもの全て走査
    for (let i = 0; i < resourcePoolTags.length; i++) {
      const rp = resourcePoolTags[i];
      for ( let j = 0; j < rp.children.length; j++ ) {
        const r = rp.children[j];

        switch ( r.tagName ) {
          case 'Component':
            const componentTag = this.createComponentTag(r);
            jdf.pushComponentTag( componentTag );
            break;
          case 'Device':
            const deviceTag = this.createDeviceTag(r);
            jdf.pushDeviceTag( deviceTag );
            break;
          case 'StitchingParams':
            const stitchingParamsTag = this.createStitchingParamsTag(r);
            jdf.pushStitchingParamsTag( stitchingParamsTag );
            break;
          case 'TrimmingParams':
            const trimmingParamsTag = this.createTrimmingParamsTag(r);
            jdf.pushTrimmingParamsTag( trimmingParamsTag );
            break;
          case 'FoldingParams':
            const foldingParamsTag = this.createFoldingParamsTag(r);
            jdf.pushFoldingParamsTag( foldingParamsTag );
            break;
          case 'CuttingParams':
            const cuttingParamsTag = this.createCuttingParamsTag(r);
            jdf.pushCuttingParamsTag(cuttingParamsTag);
            break;
          case 'CoverApplicationParams':
            const coverApplicationParamsTag = this.createCoverApplicationParamsTag(r);
            jdf.pushCoverApplicationParamsTag(coverApplicationParamsTag);
            break;
          case 'SpinePreparationParams':
            const spinePreparationParamsTag = this.createSpinePreparationParamsTag(r);
            jdf.pushSpinePreparationParamsTag(spinePreparationParamsTag);
            break;
          case 'StackingParams':
            const stackingParamsTag = this.createStackingParamsTag(r);
            jdf.pushStackingParamsTag(stackingParamsTag);
            break;

          default:
            console.log('default キタだすー : ' + r.tagName);
            const unknownResourceTag = this.createUnknownResourceTag(r);
            jdf.pushUnknownResourceTag(unknownResourceTag);
            break;
        }
      }
    }

/*
    // --- 昔のやり方（ここから） ----
    if ( resourcePoolTags.length !== 1 ) {
      console.log('げ！ resourcePoolTag.length:' + resourcePoolTags.length);
    }
    const resourcePool = resourcePoolTags[0];

    // Componentタグ
    const componentTags = resourcePool.getElementsByTagName('Component');
    console.log('componentTags.length: ' + componentTags.length);

    for (let i = 0; i < componentTags.length; ++i ) {
      const j = componentTags[i];
      // ResourcePool 直下か
      if ( j.parentElement === resourcePool ) {
        const componentTag = this.createComponentTag(j);
        jdf.pushComponentTag( componentTag );
      } else {
        console.log('はずれ！');
      }
    }

    // Deviceタグ
    const deviceTags = dom.getElementsByTagName('Device');
    console.log('deviceTags.length: ' + deviceTags.length);

    for (let i = 0; i < deviceTags.length; ++i ) {
      const deviceTag = this.createDeviceTag(deviceTags[i]);
      jdf.pushDeviceTag( deviceTag );
    }

    // StitchingParamsタグ
    const stitchingParamsTags = dom.getElementsByTagName('StitchingParams');
    console.log('stitchingParamsTags.length: ' + stitchingParamsTags.length);

    for (let i = 0; i < stitchingParamsTags.length; ++i ) {
      const stitchingParamsTag = this.createStitchingParamsTag(stitchingParamsTags[i]);
      jdf.pushStitchingParamsTag( stitchingParamsTag );
    }

    // TrimmingParamsタグ
    const trimmingParamsTags = dom.getElementsByTagName('TrimmingParams');
    console.log('trimmingParamsTags.length: ' + trimmingParamsTags.length);

    for (let i = 0; i < trimmingParamsTags.length; ++i ) {
      const trimmingParamsTag = this.createTrimmingParamsTag(trimmingParamsTags[i]);
      jdf.pushTrimmingParamsTag( trimmingParamsTag );
    }

    // FoldingParamsタグ
    const foldingParamsTags = dom.getElementsByTagName('FoldingParams');
    console.log('foldingParamsTags.length: ' + foldingParamsTags.length);

    for (let i = 0; i < foldingParamsTags.length; ++i ) {
      const foldingParamsTag = this.createFoldingParamsTag(foldingParamsTags[i]);
      jdf.pushFoldingParamsTag( foldingParamsTag );
    }

    // CuttingParamsタグ
    const cuttingParamsTags = dom.getElementsByTagName('CuttingParams');
    console.log('cuttingParamsTags.length: ' + cuttingParamsTags.length);

    for (let i = 0; i < cuttingParamsTags.length; ++i) {
      const cuttingParamsTag = this.createCuttingParamsTag(cuttingParamsTags[i]);
      jdf.pushCuttingParamsTag(cuttingParamsTag);
    }

    // CoverApplicationParamsタグ
    const coverApplicationParamsTags = dom.getElementsByTagName('CoverApplicationParams');
    console.log('coverApplicationParamsTags.length: ' + coverApplicationParamsTags.length);

    for (let i = 0; i < coverApplicationParamsTags.length; ++i) {
      const coverApplicationParamsTag = this.createCoverApplicationParamsTag(coverApplicationParamsTags[i]);
      jdf.pushCoverApplicationParamsTag(coverApplicationParamsTag);
    }

    // SpinePreparationParamsタグ
    const spinePreparationParamsTags = dom.getElementsByTagName('SpinePreparationParams');
    console.log('spinePreparationParamsTags.length: ' + spinePreparationParamsTags.length);

    for (let i = 0; i < spinePreparationParamsTags.length; ++i) {
      const spinePreparationParamsTag = this.createSpinePreparationParamsTag(spinePreparationParamsTags[i]);
      jdf.pushSpinePreparationParamsTag(spinePreparationParamsTag);
    }

    // StackingParamsタグ
    const stackingParamsTags = dom.getElementsByTagName('StackingParams');
    console.log('stackingParamsTags.length: ' + stackingParamsTags.length);

    for (let i = 0; i < stackingParamsTags.length; ++i) {
      const j = stackingParamsTags[i];
      // ResourcePool 直下か
      if (j.parentElement === resourcePool) {
        const stackingParamsTag = this.createStackingParamsTag(j);
        jdf.pushStackingParamsTag(stackingParamsTag);
      }
    }
    // --- 昔のやり方（ここまで） ----
*/

    // JDFタグ  最後が良い、多分。参照したいデータが揃っているはずなので
    const jdfTags = dom.getElementsByTagName('JDF');
    console.log('jdfTags.length: ' + jdfTags.length);

    for (let i = 0; i < jdfTags.length; ++i) {
      const jdfTag = this.createJdfTag(jdfTags[i], jdf);

      if (jdfTags[i].parentElement === null /* type === 'ProcessGroup'*/) {
        jdf.jobTag = jdfTag;
      } else {
        jdf.pushProcessTag(jdfTag);
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

  parseJDFfromString(s: string): JDF {
    return this.buildJDF(s);
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
  unknownResourceTags: UnknownResourceTag[] = [];

  beautifiedXml = '';

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
    this.unknownResourceTags = [];
  }

  getComponentTagCount(): number {
    return this.componentTags.length;
  }

  getDeviceTagCount(): number {
    return this.deviceTags.length;
  }

  getStitchingParamsTagCount(): number {
    return this.stitchingParamsTags.length;
  }

  getTrimmingParamsTagCount(): number {
    return this.trimmingParamsTags.length;
  }

  getFoldingParamsTagCount(): number {
    return this.foldingParamsTags.length;
  }

  getCuttingParamsTagCount(): number {
    return this.cuttingParamsTags.length;
  }

  getCoverApplicationParamsTagCount(): number {
    return this.coverApplicationParamsTags.length;
  }

  getSpinePreparationParamsTagCount(): number {
    return this.spinePreparationParamsTags.length;
  }

  getStackingParamsTagCount(): number {
    return this.stackingParamsTags.length;
  }

  getUnknownResourceTagCount(): number {
    return this.unknownResourceTags.length;
  }

  getProcessTagCount(): number {
    return this.processTags.length;
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

  pushUnknownResourceTag( tag: UnknownResourceTag ) {
    this.unknownResourceTags.push( tag );
  }

  pushProcessTag( tag: JdfTag ) {
    this.processTags.push( tag );
  }

  // うーん。イマイチ
  getResourceTagById( id: string ): IdHavingTag {
    let ret = null;

    if ( ret = this.getComponentTagById(id) ) {
      return ret;
    }
    if ( ret = this.getDeviceTagById(id) ) {
      return ret;
    }
    if ( ret = this.getParamsTagById(id) ) {
      return ret;
    }

    return null;
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

    if ( r = this.coverApplicationParamsTags.find((v, i, a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.cuttingParamsTags.find((v, i, a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.foldingParamsTags.find((v, i, a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.stitchingParamsTags.find((v, i, a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.spinePreparationParamsTags.find((v, i, a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.trimmingParamsTags.find((v, i, a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.stackingParamsTags.find((v, i, a) => {return v.id===id;})) {
      return r;
    }

    if ( r = this.unknownResourceTags.find((v, i, a) => {return v.id===id;})) {
      return r;
    }

    return null;
  }

  // 引数で渡すコンポーネント（用紙とか）を作成した工程を返す
  getPreviousProcesses( component: ComponentTag ): JdfTag[] {
    let ret: JdfTag[] = [];

    ret = this.processTags.filter( (value, index, array) => {
      const r = value.outputComponentLinks.filter( (v, i, ary) => {
        return (v.rRef === component.id);
      });
      return (r.length > 0);
    });
    return ret;
  }

  // 引数で渡すコンポーネント（用紙とか）を使用する工程を返す
  getNextProcesses( component: ComponentTag ): JdfTag[] {
    let ret: JdfTag[] = [];

    ret = this.processTags.filter( (value, index, array) => {
      const r = value.inputComponentLinks.filter( (v, i, ary) => {
        return (v.rRef === component.id);
      });
      return (r.length > 0);
    });
    return ret;
  }

  // 引数で渡すデバイスを利用している工程を返す
  getProcessesUsingThisDevice( component: ComponentTag ): JdfTag[] {
    let ret: JdfTag[] = [];

    ret = this.processTags.filter( (value, index, array) => {
      const r = value.deviceLinks.filter( (v, i, ary) => {
        return (v.rRef === component.id);
      });
      return (r.length > 0);
    });
    return ret;
  }

  getProcessesUsingThisParams( component: ComponentTag ): JdfTag[] {
    let ret: JdfTag[] = [];

    ret = this.processTags.filter( (value, index, array) => {
      const r = value.paramsLinks.filter( (v, i, ary) => {
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

export class IdHavingTag extends BaseTag {
  id: string;

  constructor(id: string) {
    super();

    this.id = id;
  }

  getCaption(): string {
    if ( this.id ) {
      return this.id;
    } else {
      return '';
    }
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

  getCaption(): string {
    const type = (this.type) ? this.type : '';

    if ( this.jobPartId ) {
      return type + ' [ ' + this.jobPartId + ' ]';
    } else {
      if ( this.jobId ) {
        return type + ' [ ' + this.jobId + ' ]';
      } else {
        return type;
      }
    }
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

  getCaption(): string {
    if (this.friendlyName) {
      if ( this.deviceId ) {
        return this.friendlyName + ' [ ' + this.deviceId + ' ]';
      } else {
        return this.friendlyName;
      }
    } else {
      if ( this.deviceId ) {
        return this.deviceId;
      } else {
        return super.getCaption();
      }
    }
  }
}

export class ComponentTag extends IdHavingTag {
  componentType: string;
  klass: string;
  dimensions: string; // 幅、長さ、厚さ
  body: string;

  dimensions_width: number;
  dimensions_length: number;
  dimensions_thickness: number;

  constructor(id: string, componentType: string, klass: string, dimensions: string, body: string) {
    super(id);

    this.componentType = componentType;
    this.klass = klass;
    this.dimensions = dimensions;

    if ( this.dimensions ) {
      const d = this.dimensions.split(' ');
      this.dimensions_width = JDFUtils.parseNumber(d[0]);
      this.dimensions_length = JDFUtils.parseNumber(d[1]);
      this.dimensions_thickness = JDFUtils.parseNumber(d[2]);
    }

    this.body = body;
  }

  getCaption(): string {
    if (this.componentType) {
      return this.componentType;
    } else {
      return super.getCaption();
    }
  }

  getDimensionsWidth(): number {
    return this.dimensions_width;
  }

  getDimensionsLength(): number {
    return this.dimensions_length;
  }

  getDimensionsThickness(): number {
    return this.dimensions_thickness;
  }

  getDimensionsWidth_mm(): number {
    return JDFUtils.pt2mm( this.dimensions_width );
  }

  getDimensionsLength_mm(): number {
    return JDFUtils.pt2mm( this.dimensions_length );
  }

  getDimensionsThickness_mm(): number {
    return JDFUtils.pt2mm( this.dimensions_thickness );
  }

  getDimensions_mm(): string {
    return [this.dimensions_width, this.dimensions_length, this.dimensions_thickness]
          .map( (v, i, a) => {
            return JDFUtils.pt2mm( v );
          })
          .join(' ');
  }
}

export class ParamsTag extends IdHavingTag {
  klass: string;
  body: string;

  constructor(id: string, klass: string, body: string) {
    super(id);

    this.klass = klass;

    this.body = body;
  }

    getCaption(): string {
    if (this.klass) {
      return this.klass;
    } else {
      return super.getCaption();
    }
  }
}

export class StitchingParamsTag extends ParamsTag  {
  numberOfStitches: string;
  stapleShape: string;

  constructor(id: string, klass: string, numberOfStitches: string, stapleShape: string, body: string) {
    super(id, klass, body);

    this.numberOfStitches = numberOfStitches;
    this.stapleShape = stapleShape;
  }
}

export class TrimmingParamsTag  extends ParamsTag {
  noOp: string;
  trimmingType: string;
  height: string;
  width: string;
  trimmingOffset: string;

  constructor(id: string, klass: string, noOp: string, trimmingType: string,
       height: string, width: string, trimmingOffset: string, body: string) {
    super(id, klass, body);

    this.noOp = noOp;
    this.trimmingType = trimmingType;
    this.height = height;
    this.width = width;
    this.trimmingOffset = trimmingOffset;
  }

  getWidth_mm(): number {
    return JDFUtils.pt2mm( JDFUtils.parseNumber(this.width) );
  }

  getHeight_mm(): number {
    return JDFUtils.pt2mm( JDFUtils.parseNumber(this.height) );
  }

  getTrimmingOffset_mm(): number {
    return JDFUtils.pt2mm( JDFUtils.parseNumber(this.trimmingOffset) );
  }
}

export class FoldingParamsTag  extends ParamsTag {
  descriptionType: string;
  foldCatalog: string;
  folds: FoldTag[];

  constructor( id: string, klass: string, descriptionType: string, foldCatalog: string, folds: FoldTag[], body: string ) {
    super(id, klass, body);

    this.descriptionType = descriptionType;
    this.foldCatalog = foldCatalog;
    this.folds = folds;
  }

  getCaption(): string {
    if (this.descriptionType) {
      return this.descriptionType;
    } else {
      return super.getCaption();
    }
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

export class CuttingParamsTag  extends ParamsTag {
  cutBlocks: CutBlockTag[];

  constructor( id: string, klass: string, cutBlocks: CutBlockTag[], body: string ) {
    super(id, klass, body);

    this.cutBlocks = cutBlocks;
  }
}

export class CutBlockTag  extends IdHavingTag { // うーん。ParamsTagから継承するのは意味的にイマイチか？ParamsTagの名称を変えるべきか
  klass: string;
  blockType: string;
  blockName: string;
  blockSize: string;
  blockTrf: string;
  body: string;

  block_width: number;
  block_height: number;
  block_x: number;
  block_y: number;
  block_zz: string; // なんて呼べば良いんだろう。BlockTrf の残り部分（頭部分）

  constructor( id: string, klass: string, blockType: string, blockName: string, blockSize: string, blockTrf: string, body: string ) {
    super(id);

    this.klass = klass;
    this.blockType = blockType;
    this.blockName = blockName;
    this.blockSize = blockSize;
    this.blockTrf = blockTrf;

    this.body = body;

    const b = blockSize.split(' ');
    this.block_width = JDFUtils.parseNumber(b[0]);
    this.block_height = JDFUtils.parseNumber(b[1]);

    // 正規表現を使って分解
    // [1]: '1 0 0 1'
    // [2]: x座標
    // [3]: y座標
    const rx = /^(\d+\s+\d+\s+\d+\s+\d+)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/;
    const result = blockTrf.match(rx);

    if (result) {
      console.log(' ---- Hit! ---- ');
      console.log('  length: ' + result.length);
      for (let i = 0; i < result.length; i++) {
        console.log('  [' + i + '] ' + result[i]);
      }

      this.block_zz = result[1];
      this.block_x = JDFUtils.parseNumber(result[2]);
      this.block_y = JDFUtils.parseNumber(result[3]);
    } else {
      console.log(' ---- FAILED! ---- ');
    }
  }

  getBlockWidth(): number {
    return this.block_width;
  }

  getBlockWidth_mm(): number {
    return JDFUtils.pt2mm( this.block_width );
  }

  getBlockHeight(): number {
    return this.block_height;
  }

  getBlockHeight_mm(): number {
    return JDFUtils.pt2mm( this.block_height );
  }

  getBlockZz(): string {
    return this.block_zz;
  }

  getBlockX(): number {
    return this.block_x;
  }

  getBlockX_mm(): number {
    return JDFUtils.pt2mm( this.block_x );
  }

  getBlockY(): number {
    return this.block_y;
  }

  getBlockY_mm(): number {
    return JDFUtils.pt2mm( this.block_y );
  }
}

export class CoverApplicationParamsTag  extends ParamsTag {
  noOp: string;

  constructor( id: string, klass: string, noOp: string, body: string ) {
    super(id, klass, body);

    this.noOp = noOp;
  }
}

export class SpinePreparationParamsTag  extends ParamsTag {
  millingDepth: string;

  constructor( id: string, klass: string, millingDepth: string, body: string ) {
    super(id, klass, body);

    this.millingDepth = millingDepth;
  }
}

export class StackingParamsTag  extends ParamsTag {
  standardAmount: string;
  layerAmount: string;

  constructor( id: string, klass: string, standardAmount: string, layerAmount: string, body: string ) {
    super(id, klass, body);

    this.standardAmount = standardAmount;
    this.layerAmount = layerAmount;
  }
}

interface NameValue {
  name: string;
  value: string;
}

export class UnknownResourceTag  extends IdHavingTag {
  tagName: string;
  attributes = new Array<NameValue>();
  body: string;

  constructor( tagName: string, attributes: any, body: string ) {
    super('');

    this.tagName = tagName;
    this.attributes = [];

    for (let i = 0; i < attributes.length; i++ ) {
      this.attributes.push( {
        name: attributes[i].name,
        value: attributes[i].value
      });
    }

    const id = this.attributes.find((v, i, a) => {return (v.name === 'ID');});
    if (id) {
      this.id = id.value;
    }

    this.body = body;
  }
/*
  getAttributesArray() {
    let r = [];
    for( let k in this.attributes) {
      r.push(k);
    }
    return r;
  }
  */
  getCaption(): string {
    return 'Unknown: ' + this.tagName;
  }
}

class LinkTag  extends BaseTag {
  usage: string;
  rRef: string;
  amount: string;

  rResource: IdHavingTag; // rRef が指す Resource

  constructor( usage: string, rRef: string, amount: string, rResource: IdHavingTag ) {
    super();

    this.usage = usage;
    this.rRef = rRef;
    this.amount = amount;

    this.rResource = rResource;
  }
}

class ComponentLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string, rResource: IdHavingTag ) {
    super( usage, rRef, amount, rResource );
  }
}

class CoverApplicationParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string, rResource: IdHavingTag ) {
    super( usage, rRef, amount, rResource );
  }
}

class SpinePrearationParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string, rResource: IdHavingTag ) {
    super( usage, rRef, amount, rResource );
  }
}

class StitchingParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string, rResource: IdHavingTag ) {
    super( usage, rRef, amount, rResource );
  }
}

class TrimmingParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string, rResource: IdHavingTag ) {
    super( usage, rRef, amount, rResource );
  }
}

class CuttingParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string, rResource: IdHavingTag ) {
    super( usage, rRef, amount, rResource );
  }
}

class FoldingParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string, rResource: IdHavingTag ) {
    super( usage, rRef, amount, rResource );
  }
}

class DeviceLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string, rResource: IdHavingTag ) {
    super( usage, rRef, amount, rResource );
/*
    if ( this.rResource ) {
      console.log('devLink ctr: ' + this.rResource.getCaption());
    } else {
      console.log('devLink ctr: ????');
    }
  */
  }
}

class StackingParamsLinkTag extends LinkTag {
  constructor( usage: string, rRef: string, amount: string, rResource: IdHavingTag ) {
    super( usage, rRef, amount, rResource );
  }
}

class UnknownResourceLinkTag extends LinkTag {
  tagName: string;
  attributes = new Array<NameValue>();

  constructor( tagName: string, attributes: any, rResource: IdHavingTag ) {
    super('', '', '', rResource);

    this.tagName = tagName;
    for (let i = 0; i < attributes.length; i++) {
      this.attributes.push( {
        name: attributes[i].name,
        value: attributes[i].value
      });
    }

    console.log(' UnknownResourceLinkTag - ' + this.tagName + ' ------- ' );
    const usage = this.attributes.find((v, i, a) => {return (v.name === 'Usage');});
    if (usage) {
      this.usage = usage.value;
      console.log('  * ' + this.usage);
    }
    const rRef = this.attributes.find((v, i, a) => {return (v.name === 'rRef');});
    if (rRef) {
      this.rRef = rRef.value;
      console.log('  * ' + this.rRef);
    }
    const amount = this.attributes.find((v, i, a) => {return (v.name === 'Amount');});
    if (amount) {
      this.amount = amount.value;
      console.log('  * ' + this.amount);
    }
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
