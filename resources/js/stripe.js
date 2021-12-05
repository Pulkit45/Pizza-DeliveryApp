
import {loadStripe} from '@stripe/stripe-js'
import { placedOrder } from './apiService'
import { CardWidget } from './CardWidget';


export async function initStripe(){
    const stripe = await loadStripe('pk_test_51K2dxhSHC5CAtpazcBiEzeu15w7RBH9rPNGIBCoCpZgLXl42uqleXvqYJ6wCdygD28HAT0GjOfrTGKf6pbBOdPpK00b7Yw7TaT');
    let card =null;
// //     function mountWidget(){
// //         const elements=stripe.elements()
    
// //         let style = {
// //            base: {
// //            color: '#32325d',
// //            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
// //            fontSmoothing: 'antialiased',
// //            fontSize: '16px',
// //            '::placeholder': {
// //                color: '#aab7c4'
// //            }
// //            },
// //            invalid: {
// //            color: '#fa755a',
// //            iconColor: '#fa755a'
// //            }
// //        };

// //     card=elements.create('card',{style,hidePostalCode:true})
// //    card.mount('#card-element')
//     }



    const paymentType=document.querySelector('#paymentType');
    if(!paymentType){
        return;

    }
    paymentType.addEventListener('change',(e)=>{

           console.log(e.target.value)
           if(e.target.value === 'card'){
               // Display Widget
              card= new CardWidget(stripe)
              card.mount()
            //    mountWidget();



           }else{
               //cash on deleivery
               card.destroy()
           }

    })
    //Ajax call
const paymentForm=document.querySelector('#payment-form');
if(paymentForm){
    paymentForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        let formData=new FormData(paymentForm)
        let formObejct={}
        for(let [key,value] of formData.entries()){
            formObejct[key]=value
            
    
        }
        if(!card){
            // Ajax call
            placedOrder(formObejct);
            return;
        }
      const token=  await card.createToken()
      formObejct.stripeToken=token.id;
      placedOrder(formObejct);

        // //verify card
        // stripe.createToken(card).then((result)=>{
        //     console.log(result)
        //     formObejct.stripeToken=result.token.id;
        //     placedOrder(formObejct);

        // }).catch((err)=>{
        //     console.log(err)
        // })





        
       
    })

}
}