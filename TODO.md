Página Recharge:
el quick recharge debe cambiar, no añades salgo en general, hay que primero decirle a qué contrato lo añades, y eso se te queda en un carrito, una vez has llenado todos los contratos que querías, desde el carrito (puede ser un drawer) se te va a la página de pagar. CUando esto funcione, implementar el endpoint de suggest, es una feature en la página de recharge que le dices la cantidad de días y total a cargar y te sugiere la cantidad a cargar en cada contrato.

Pagos: 
Mirar lo de stripeIntent al pagar, preparar ya todo el flujo, el cliente decía que quería saltarse stripe y tenía él un endpoint, investigar los que hay. 

Página History:
En history, cada uno debe tener un botón de ver PDF (creo que es buContractID). Si existe ese id enseñar el botón y al darle click al botón se te abre el PDF en una página nueva

Page Usage:
Usar el endpoint "/Api/v1/Graphics/GetGroupedCosts", a parte de el filtro de tiempo, añadir de qué contratos quieres ver las estadísticas (un dropdown), de default es todos, o puedes seleccionar solo uno de la lista.

En settings, en Support Center añadir "Information / FAQ", te lleva a una página con este contenido: 
FAQ - Piattaforma EnergyDynamics®
1. EnergyDynamics® è disponibile per tutti?
Se hai un contatore intelligente (Smart Meter), puoi attivare EnergyDynamics® in modalità prepagamento. Facile, comodo, flessibile.
 
2. Come viene calcolato il consumo?
Ogni giorno il sistema calcola quanta energia consumi e sottrae il relativo costo dal tuo credito. Il prezzo si basa sulla tua categoria (domestica o commerciale) secondo il nostro tariffario.
 
3. Ho più forniture: posso usare EnergyDynamics® ovunque?
Sì! Basta che ogni punto abbia un contatore intelligente installato.
 
4. Posso pagare vecchie fatture con il credito?
Sì. Se ci sono arretrati, puoi recuperarli con piccole rate giornaliere. Vale solo per il contratto attivo su EnergyDynamics®.
 
5. Finito il credito: resto subito senza corrente?
No, hai 7 giorni di tempo per ricaricare. Riceverai avvisi via SMS/email:
- 1° avviso: credito quasi esaurito, ma ancora attivo.
- 2° avviso: credito negativo, serve una ricarica.
- 3° avviso: fine del periodo di tolleranza.
- 4° avviso: corrente staccata. Serve una ricarica > credito negativo.
Nel portale vedrai lo stato del tuo contratto:
- ATTIVO: corrente attiva.
- GRAZIA: credito negativo, ricarica al più presto!
- BLOCCATO: corrente sospesa. Serve ricarica superiore al debito.
 
6. Cosa faccio se il credito è negativo?
Ricarica il prima possibile. Consigliamo sempre di ricaricare più del debito. Esempio:
- Saldo attuale: CHF -55.00
- Ricarica: CHF 100.00
- Nuovo saldo: CHF +45.00
 
7. Riceverò comunque una fattura?
Sì, ma solo una volta all'anno, per il conguaglio e la visione completa dei tuoi consumi.
 
8. Dove posso ricaricare?
Puoi acquistare ricariche presso rivenditori accreditati (senza minimo) oppure tramite il portale se la tua azienda elettrica lo prevede. Le ricariche dal portale sono a importi fissi (es. CHF 20, 50, 100). Importo massimo: CHF 3'000.00 a ricarica.
 
9. Che segnali mi dà il contatore se resto senza corrente?
Si accende una luce blu intermittente. Significa che la fornitura è stata sospesa.
 
10. Se ricarico, torna subito la corrente?
Sì. Dopo la ricarica (superiore al debito), la corrente torna in pochi minuti. Vedrai il cambio di stato nel portale. Premi il tasto -1- sul contatore per 4-8 secondi. La luce blu si spegne e sei di nuovo operativo.
Consiglio: tieni a portata il numero del tuo contatore. Controlla che gli apparecchi spenti prima non si riattivino da soli.
 
11. E se la corrente non torna dopo aver ricaricato?
Se dopo aver effettuato correttamente la ricarica e aver premuto il tasto -1- la corrente non ritorna entro 5-10 minuti, contatta subito il Supporto Clienti per assistenza. 

---
En la card de un contrato, cuando days remaining es negativo, habría que poner otra cosa para que se entienda mejor, por ejemplo "Recharge needed" o algo así, y el color del texto en rojo.