import { createAction, props } from "@ngrx/store";

// manage global states
export const ChangeGetData = createAction('[General] Change GetData');

export const ChangeToCel = createAction('ChangeToCel');
export const ChangeToFer = createAction('ChangeToFer');

export const UdateLocationAutoComplete = createAction('[Auto-Complete] Udate location AutoComplete Success',props<{allLocations:any[]}>());
export const UpdateCurrentLocation = createAction('[Current-Location] Update Current Location Success',props<{currentCity:any}>());
export const UpdateLocationCurrentWeather = createAction('[Current-Weather] Update Location Current Weather Success',props<{currentCityWeather:any}>());
export const UpdateForecast5Days = createAction('[Current-Weather] Update Forecast 5 Days Success',props<{forecast:any[]}>());

// manage favorites places
export const AddToFavorite = createAction('AddToFavorite',props<{favorites:any[]}>());
export const DeleteFromFavorite = createAction('DeleteFromFavorite',props<{favorites:any[]}>());

//handel errors
export const UpdateFail = createAction('Update failed');

