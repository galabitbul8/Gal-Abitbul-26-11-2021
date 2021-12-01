import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppAction from "../../state/app.actions";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isThemeLight: boolean = false;
  currentUnit$!: string;
  currentUnit: string ="&#8451;"; // default unit temperature
  currentIconTheme:string="dark_mode";
  dark_mode:string = "dark_mode";
  light_mode:string = "wb_sunny";
  constructor(private store:Store<any>) { }
  ngOnInit(): void {
    this.store.select('app').subscribe((state)=>{
      this.currentUnit$ = state.temperatureUnit;
    })
  }

  //change unit temperature
  changeUnits():void {
    if(this.currentUnit == '&#8451;'){ // change from C to F
      this.currentUnit = "&#8457;";
      this.store.dispatch({
        type:'ChangeToFer'
      });
    }
    else{                              
      this.currentUnit = "&#8451;";// change from F to C
      this.store.dispatch({
        type:'ChangeToCel'
      });
    }
  }
}
