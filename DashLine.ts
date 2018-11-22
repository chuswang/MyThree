/**
 *
 *@since 2.0
 *@author zhiguo
 *@Date 2018/5/28 8:45
 */
import {
  BrowserInfo
} from '../../../../../src/model/BrowserInfo';
import {
  BrowserUtil
} from '../../../../../src/util/BrowserUtil';
import * as THREE from 'three';
import { TimelineLite, Power0, TweenMax } from 'gsap';
import { Mesh, WebGLRenderer } from 'three';
import { PerspectiveCamera } from 'three';

const OBJLoader = require('three-obj-loader');

const MeshLine = require('three.meshline').MeshLine;
const MeshLineMaterial = require('three.meshline').MeshLineMaterial;

const OrbitControls = require('three-orbitcontrols');
OBJLoader(THREE);

export class DashLine {

  /*
      这个类主要是做一个兼容判定
      判断是Ipad时用three自带的虚线
      不是Ipad时用我们给的虚线meshLIne
   */

  browserInfo: BrowserInfo;

  private geometryLine: any;
  private dottedLine: any;

  private tween: any;

  private timeDottedLine: any;

  constructor() {
    this.browserInfo = BrowserUtil.getBrowserInfo();
  }

  addLine(pointArr: any, color: any, linewidth: number, dashLine: any) {

    /*
        startPoint: 起始点
        endPoint: 终点
        color: 线条颜色
        linewidth: 线框
        dashLine: 是否是虚线 true是虚线  false是实线
     */

    if (this.browserInfo.isIpad) {
      if (dashLine) {
        this.geometryLine = new THREE.Geometry();
        this.geometryLine.vertices = pointArr;
        this.dottedLine = new THREE.LineSegments(this.geometryLine, new THREE.LineDashedMaterial({
          color: color,
          dashSize: 0.1,
          gapSize: 0.1,
          linewidth: linewidth / 500,
          depthTest: false
        }));

        this.dottedLine.computeLineDistances();

      } else {
        this.geometryLine = new THREE.Geometry();
        this.geometryLine.vertices = pointArr;
        this.dottedLine = new THREE.Line(this.geometryLine, new THREE.LineBasicMaterial({
          color: color,
          linewidth: linewidth / 500,
          depthTest: false
        }));
      }




    } else {
      this.geometryLine = new THREE.Geometry();

      this.geometryLine.vertices = pointArr;

      this.dottedLine = this.createLine(this.geometryLine, dashLine, color, linewidth / 1000);
    }

    // this.tween = {x: startPoint.x, y: startPoint.y, z: startPoint.z};
    return this.dottedLine;
  }

  // 用来画meshLine虚线
  createLine(geometry: any, dashLine: boolean, color: any, lineWidth: number) {
    const g = new MeshLine();
    g.setGeometry(geometry);

    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

    const material = new MeshLineMaterial({
      useMap: false,
      color: new THREE.Color(color),
      opacity: 1,
      dashArray: 0.05,
      dashOffset: 0,
      dashRatio: 0.5,
      resolution: resolution,
      // sizeAttenuation: false,
      lineWidth: lineWidth,
      near: 1,
      far: 100,
      depthWrite: false,
      depthTest: false,
      alphaTest: false ? .5 : 0,
      side: THREE.DoubleSide,
      transparent: dashLine,
    });

    const mesh = new THREE.Mesh(g.geometry, material);

    return mesh;
  }

  // 虚线动画
  animation(startPoint: any, endPoint: any, time: number) {

    if (this.browserInfo.isIpad) {
      this.timeDottedLine = TweenMax.to(this.tween, time, {
        x: endPoint.x,
        y: endPoint.y,
        z: endPoint.z,
        onUpdate: () => {
          this.updateDottedLine1(startPoint);
        },
        paused: true
      });
    } else {
      this.timeDottedLine = TweenMax.to(this.tween, time, {
        x: endPoint.x,
        y: endPoint.y,
        z: endPoint.z,
        onUpdate: () => {
          this.updateDottedLine2(startPoint);
        },
        paused: true
      });
    }

    return this.timeDottedLine;
  }

  // 用于更新苹果机虚线动画
  updateDottedLine1(startPoint: any) {
    this.geometryLine = new THREE.Geometry();

    const endPoint = new THREE.Vector3(this.tween.x, this.tween.y, this.tween.z);
    this.geometryLine.vertices = [startPoint, endPoint];

    this.dottedLine.geometry.dispose();
    this.dottedLine.geometry = this.geometryLine;
    this.dottedLine.computeLineDistances();
  }

  // 用于更新非苹果机虚线动画
  updateDottedLine2(startPoint: any) {
    this.geometryLine = new THREE.Geometry();

    const endPoint = new THREE.Vector3(this.tween.x, this.tween.y, this.tween.z);
    this.geometryLine.vertices.push(startPoint);
    this.geometryLine.vertices.push(endPoint);

    this.dottedLine.geometry.dispose();
    const g = new MeshLine();
    g.setGeometry(this.geometryLine);
    this.dottedLine.geometry = g.geometry;
  }

}