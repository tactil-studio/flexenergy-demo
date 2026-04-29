Página Recharge:
el quick recharge debe cambiar, no añades salgo en general, hay que primero decirle a qué contrato lo añades, y eso se te queda en un carrito, una vez has llenado todos los contratos que querías, desde el carrito (puede ser un drawer) se te va a la página de pagar. CUando esto funcione, implementar el endpoint de suggest, es una feature en la página de recharge que le dices la cantidad de días y total a cargar y te sugiere la cantidad a cargar en cada contrato.

Pagos: 
Mirar lo de stripeIntent al pagar, preparar ya todo el flujo, el cliente decía que quería saltarse stripe y tenía él un endpoint, investigar los que hay. 

Página History:
En history, cada uno debe tener un botón de ver PDF (creo que es buContractID). Si existe ese id enseñar el botón y al darle click al botón se te abre el PDF en una página nueva

Page Usage:
Usar el endpoint "/Api/v1/Graphics/GetGroupedCosts", a parte de el filtro de tiempo, añadir de qué contratos quieres ver las estadísticas (un dropdown), de default es todos, o puedes seleccionar solo uno de la lista.
 
---
En la card de un contrato, cuando days remaining es negativo, habría que poner otra cosa para que se entienda mejor, por ejemplo "Recharge needed" o algo así, y el color del texto en rojo.