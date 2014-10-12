//Código optimizado de geolocalización para ciclovía
//en el método de localización contínua este algoritmo incluirá en el arreglo los puntos cada 8 segundos
//los metros se contarán cada segundo para aumentar la precisión en el dato final
cambio=0;
funcion{
[arregloDePuntos addObject:[NSNumber numberWithDouble:distMetros]];
CLLocation *pointALocation = [[CLLocation alloc] initWithLatitude:OldLocation.latitude longitude:OldLocation.longitude];
CLLocation *pointBLocation = [[CLLocation alloc] initWithLatitude:NewLocation.latitude longitude:NewLocation.longitude];
if (cambio==8) { 
 [coordenadasParaDibujar addObject:pointALocation];
       cambio =0;
}
 else
  cambio++;
}

//Finalmente, en el momento de guardar convertimos el arreglo de puntos a formato JSON
for(int i = 0; i < coordenadasParaDibujar.count; i++) {
		CLLocation* location = [coordenadasParaDibujar objectAtIndex:i];
        NSDictionary *dic=[[NSDictionary alloc]initWithObjectsAndKeys:[NSString stringWithFormat:@"%f",location.coordinate.latitude],@"lat",[NSString stringWithFormat:@"%f",location.coordinate.longitude],@"lon",[NSString stringWithFormat:@"%f",location.coordinate.altitude],@"alt", nil];
		[arrayDePuntos addObject:dic];
	}
    NSError *error;
    NSData *jsonData2 = [NSJSONSerialization dataWithJSONObject:arrayDePuntos options:NSJSONWritingPrettyPrinted error:&error];
    NSString *jsonString = [[NSString alloc] initWithData:jsonData2 encoding:NSUTF8StringEncoding];
    NSLog(@"jsonData as string:\n%@", jsonString);