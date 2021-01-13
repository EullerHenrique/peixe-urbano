import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { OfertasService } from '../ofertas.service';
import { Oferta } from '../shared/oferta.model';

@Component({
  selector: 'peixe-urbano-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css'],
  providers: [ OfertasService ]
})
export class TopComponent implements OnInit {

  private ofertas: Observable<Oferta[]>;
  private subjectPesquisa: Subject<string> = new Subject<string>();

  constructor(private OfertasService: OfertasService) { }

  ngOnInit() {


    this.ofertas = this.subjectPesquisa
                       .debounceTime(1000)
                       .distinctUntilChanged()
                       .switchMap((termoDaPesquisa: string) => {
                          console.log('requisicao http para api');

                          if(termoDaPesquisa.trim() === ''){
                            return Observable.of<Oferta[]>([])
                          }
                          
                          return this.OfertasService.pesquisaOfertas(termoDaPesquisa);
                       })
                       .catch((err: any) => {  
                          console.log(err);
                          return Observable.of<Oferta[]>([]);
                       });




    // Observeble (Observável)
    // Subjcect atuando na condição de observável

    //Obs: Toda vez que o observavel adquirir um novo valor, uma função de callback receberá o novo valor

    this.ofertas.subscribe((ofertas: Oferta[]) => 
                                console.log(ofertas)
                              );                  


  }

  public pesquisa(termoDaPesquisa: string): void{


    // Observer (observador)
    // Subject atuando na condição de observador

    console.log('keyup caracter', termoDaPesquisa);
    this.subjectPesquisa.next(termoDaPesquisa);

  }

}
