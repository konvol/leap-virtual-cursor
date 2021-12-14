import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { LeapService } from '../leap.service';
import * as $  from 'jquery';
// import { element } from 'protractor';

declare var $: any;

@Component({
  selector: 'app-virtual',
  templateUrl: './virtual.component.html',
  styleUrls: ['./virtual.component.scss']
})
export class VirtualComponent implements OnInit {

  /*****************************/

  @Input() elements2Check = ['btn1', 'btn2', 'btn3', 'btn4'];
  @Input() waitingTime = 80;
  @Input() size = 40;
  @Input() color = 'black';
  //@ViewChild('button') button: ElementRef;
  @ViewChild('vcur') vcur: ElementRef;
  gesture: string;
  buttonRect: any;
  vcurRect: any;
  public clickEvents:string[] = [];
  private intervalBetweenClicks = 3000; //ms ==> recognize pinch every 3 seconds
  /*****************************/

  public cursorStyle;
  public cursorSize;

  public loading = {
    width: '0%'
  }

  /*****************************/

  private cursorCounter = 0;
  private onItemCounter = 0;
  private itemSelected;


  /*****************************/

  constructor(
    public leap: LeapService,
    private elementRef: ElementRef
    ) {


  }

  /*****************************/
  private x;
  private y;
  ngOnInit() {
    this.elements2Check.forEach(element=>{
      $('#' + element).click(
        () => {this.addClickEvent("clicked button: " + element);}
      );
    })
    
    setInterval(() => {
      this.cursorCounter++;
      if (this.cursorCounter == 5) {
        this.resetCursor();
        this.cursorStyle.display = 'none';
      }
    }, 200);

    this.leap.cursorRecognizer().subscribe((leapPos) => {
      this.cursorStyle.left = leapPos.xPos + 'px';
      this.cursorStyle.top = leapPos.yPos + 'px';
      this.x = leapPos.xPos;
      this.y = leapPos.yPos; 
      this.cursorStyle.display = 'block';

      this.cursorCounter = 0;
      if(!this.clicked)
        this.checkCursorHovering();
    });

    this.updateCursorLook();
  }

  addClickEvent(event:string)
  {
    console.log(event)
    this.clickEvents.push(event);
  }  
  
  /*****************************/

  private updateCursorLook() {
    this.cursorSize = {
      width: this.size + 'px',
      height: this.size + 'px',
      "background-color": this.color
    };

    this.cursorStyle = {
      top: '0px',
      left: '0px',
      display: 'none',
      width: this.size + 'px',
      height: this.size + 'px'
    };
  }

  /*****************************/
  private clicked = false;
  private checkCursorHovering() {
    if(!this.clicked && this.leap.gestureRecognized === "PINCH"){
      this.pauseClicks();
      this.leap.gestureRecognized = '';
      let event = new MouseEvent('click');
      const el = document.elementFromPoint(this.x, this.y);
      el.dispatchEvent(event);
    }

  }

  private pauseClicks(){
    this.clicked = true;
    setInterval(()=>{this.clicked = false}, this.intervalBetweenClicks)
  }
  /*****************************/

  // private updateCursor() {
  //   this.loading.width = (this.onItemCounter / this.waitingTime * 100) + '%';

  //   if (this.onItemCounter == this.waitingTime) {
  //     let event = new MouseEvent('click');
  //     this.itemSelected.dispatchEvent(event);
  //     this.resetCursor();
  //   }
  // }

  /*****************************/

  private resetCursor() {
    this.onItemCounter = 0;
    this.itemSelected = null;
    this.loading.width = '0%';
  }

  /*****************************/

}
