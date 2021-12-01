import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalConstants } from 'src/app/common/global-constants';
import { LocationService } from 'src/app/services/location.service';
import * as AppAction from "../../state/app.actions";

import {FormControl} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { City } from 'src/app/state/app.reducer';

//alert
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})

export class CurrentWeatherComponent implements OnInit {
  AutoCompleteObservable?:Subscription;
  CurrentWeatherObservable?:Subscription;
  state?:Subscription;

  location$:any; // for current location name and key
  CurrentWeather$:any; // for current weather
  Favorites$:any[]=[];
  showError$:any;
  
  CurrentWeather: any;
  Favorites:Array<any>=[];
  currentDate:Date = new Date();
  currentFullDate:string = "";

  //unit
  unit$!:string;
  currentUnit:string=" &#8451;";

  //favorite icons
  FavoriteIcon:string="favorite";
  UnFavoriteIcon:string="favorite_border";
  icon:string ="favorite_border";
  imageCurrentWeather:string = "";

  // for search input
  control = new FormControl();
  cities: string[]=[];
  filteredCities: Observable<string[]> | undefined;
  citiesWithKey:City[]=[];

  constructor(private store:Store<any>, private locationService:LocationService,private _snackBar: MatSnackBar) { 
    //convert the cureent date to full date in a string
    this.currentFullDate = GlobalConstants.days[this.currentDate.getDay()] + ", " + this.currentDate.getDate() + " " + 
      GlobalConstants.monthName[this.currentDate.getMonth()] + " " + this.currentDate.getFullYear();
  }


  ngOnInit(): void {
    // pull state data from the app selector and bind them to the variables in the component
    this.state = this.store.select('app').subscribe(state => {
        this.location$ = state.currentLocation;
        this.CurrentWeather$ = state.locationCurrentWeather;
        this.Favorites$ = state.Favorites
        this.unit$ = state.temperatureUnit;
        this.showError$ = state.failed;

    });
    this.getCurrentWeather();
    this.favoriteCheck();
  }

  // set on display default weather
  getCurrentWeather():void{
    this.CurrentWeatherObservable = this.locationService.loadCurrentWeater(this.location$,this.showError$).subscribe(
      (data) =>{
        if(data.length<1){
          return;
        }
        else{
          //upload to store in locationCurrentWeather
          this.store.dispatch(AppAction.UpdateLocationCurrentWeather({ currentCityWeather: {
            date: data[0]['LocalObservationDateTime'],
            Temperature: data[0]['ApparentTemperature']['Metric']['Value'],
            WeatherIcon:GlobalConstants.getIconWeather(data[0]['WeatherIcon']),
            WeatherText : data[0]['WeatherText'],
            RealFeelTemperature:data[0]['RealFeelTemperature']['Metric']['Value'],
            RealFeelTemperatureShade:data[0]['RealFeelTemperatureShade']['Metric']['Value'],
            RelativeHumidity:data[0]['RelativeHumidity']+'%',
            Wind:data[0]['Wind']['Speed']['Metric']['Value'] + data[0]['Wind']['Speed']['Metric']['Unit']
            } as any }));
        } 
      }
    )


  }
  //check if the location in the 
  favoriteCheck():void{
    if(this.searchFavoriteByKey(this.location$.key)){
      this.icon = this.FavoriteIcon;
    }else{
      this.icon = this.UnFavoriteIcon;
    }
  }

  // toast message 
  openSnackBar(message: string){
    this._snackBar.open(message, "x",{
      duration:8000
    });

  }

  //action that happend when we press on the heart
  favoriteAction():void{
    if(this.icon == this.UnFavoriteIcon){
      this.icon = this.FavoriteIcon;
      //add to the favorites in the store
      this.store.dispatch(AppAction.AddToFavorite({favorites:this.getFavorites()}));
      this.openSnackBar("Add Location to Favorites Success");

        }else{
      this.icon = this.UnFavoriteIcon;
      //remove from favorites in the store
      this.store.dispatch(AppAction.DeleteFromFavorite({favorites:this.removeFavoriteByKey(this.location$.key)}))
      this.openSnackBar("Delete Location to Favorites Success");
    }
  }

  //get all favorite location and show them on the screen
  getFavorites():any[]{
    this.Favorites = Array.from(this.Favorites$);
    let date = new Date(this.CurrentWeather$.date);
    let fullDate = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    this.Favorites.push({
      ID:(Math.random()*1000).toFixed(0),
      locationName:this.location$.name,
      locationKey:this.location$.key,
      country:this.location$.country,
      date:fullDate,
      Icon:this.CurrentWeather$.WeatherIcon,
      Temperature:this.CurrentWeather$.Temperature,
    })
    return this.Favorites;
  }

  // return if the location in the favorites array or not
  searchFavoriteByKey(key:string):boolean{
    let res = false;
    this.Favorites$.forEach((element)=>{
      if(element.locationKey==key)
        res = true;
    })
    return res;
  }

  //return an array without the item we want to delete by keyCode
  removeFavoriteByKey(key:string):any[]{
    let indexToDelete = -1;
    let newFavorites:any[] = [];
    this.Favorites$.forEach((element,index:number)=>{
      if(element.locationKey===key){
        indexToDelete = index
      }else{
        newFavorites.push(element);
      }
    })
    return newFavorites;
  }

  //for search input - done
  getLocations(event:any):void{
    if(event.key.charCodeAt(0)>=65 && event.key.charCodeAt(0)<=122 && event.key !== "Alt" && event.key !== "Backspace" && event.key !== "CapsLock" && event.key!=="Control" || event.key==="Space"){
      this.cities = [];
      this.citiesWithKey = [];
      //call api requset for auto complete
      this.AutoCompleteObservable = this.locationService.loadLocationAutoComplete(this.control.value,this.showError$) // todo: add error handling
      .subscribe(
        (cities) => { // cities - response Object from API
          if(cities == null || cities == undefined || cities.length == 0){
            this.cities = [];
          }else{
            cities.forEach((element:any) => {
              // build array with name and keyCode to recive the key code of the city name
              this.citiesWithKey.push({ 
                name:element['LocalizedName'],
                key:element['Key'],
                country:element['Country']['LocalizedName']
              });
              this.cities.push(element['LocalizedName'])//build array for autocomplete
            });
            this.filteredCities = this.control.valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value)),
            );
          }        
          //push to the store
          this.store.dispatch(
            AppAction.UdateLocationAutoComplete({ allLocations: cities as any[] })
          );
        });
    }

  }

  //filter the list results after every key press(value) - done
  private _filter(value: string): string[] {
    if(this.control.value == "")
      return [];
    else
      return this.cities.filter((city:string) => city.toLowerCase().startsWith(value.toLowerCase()));
  }

  //get new locations filter after insert in the search input
  submit(){
    // search in the locations for name and key
    // put name and key code in store (currentLocation)
    if(this.showError$){
      this.openSnackBar("There is an error probably beacuse we use in free trail api, please try again later");
      return;
    }
    this.citiesWithKey.forEach((element:any)=>{
      if(element['name'] === this.control.value){
        //update the current location
        this.store.dispatch(
          AppAction.UpdateCurrentLocation({ currentCity: {name:element['name'],key:element['key'],country:element['country']} as any })
        );
        this.getCurrentWeather();
        this.favoriteCheck();
        this.control.setValue('');
        // get new data from the store data
        this.store.dispatch(
          AppAction.ChangeGetData()
        );
        return;
      }
    })

  }

  checkEnglish(event:any){
    // A-z is 65-122 and space is 32
    if((event.keyCode >= 65 && event.keyCode <= 122)){
      // this.getLocations();
      return true;
    }
    else if(event.keyCode == 32){
      return true;
    }
    else
      return false;
  }
  //cel to fer
  CelToFer(temp:number,unit:string):number{
    if(unit=='F'){
      this.currentUnit = " &#8457"
      return parseInt(((temp * 1.8)+32).toFixed(0));

    }
    this.currentUnit = " &#8451;"
    return temp;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.AutoCompleteObservable?.unsubscribe();
    this.CurrentWeatherObservable?.unsubscribe();
    this.state?.unsubscribe();
  }

  
}
