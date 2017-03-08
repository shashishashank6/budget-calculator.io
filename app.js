var budgetController=(function(){
   var Expense=function(id,description,value){
       this.id=id;
       this.description=description;
       this.value=value;
       this.percentage=-1;
   }
   Expense.prototype.calcPercentage=function(totalIncome){
       if(totalIncome>0){
       this.percentage=Math.round((this.value/totalIncome)*100);
   }else{
       this.percentage=-1;
   }
   };
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    };
    var Income=function(id,description,value){
       this.id=id;
       this.description=description;
       this.value=value;
   }
    
    var calculateTotal=function(type){
      var sum=0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;//eg:calculate sum of numbers
        });
        data.totals[type]=sum;
    };
    
    var data={
    allItems:{
        exp:[],
        inc:[]
    },
        totals:{
            inc:0,
            exp:0
        },
        budget:0,
        percentage: -1
    };
    return {
        addItem:function(type,des,val){
            var newItem,ID;
            //ID=last ID +1
            //creating ID
            if(data.allItems[type].length>0){
            ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else{
                ID=0;
            }
            if(type==="exp"){
            newItem=new Expense(ID,des,val);
            }
            else if(type==="inc"){
                newItem=new Income(ID,des,val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        deletItem:function(type,id){
            var index;
            //id=6
            //data.allItems[type][id]
            //ids=[1 2 4 6 8]
            //index=3
            var ids=data.allItems[type].map(function(current){
               return current.id; 
            });
            index=ids.indexOf(id);
            if(index!==-1){
                //The splice() method adds/removes items to/from an array, and returns the removed item(s).
                data.allItems[type].splice(index,1);
            }
        },
        
        calculateBudget:function(){
            //calculate total income and expenses
         calculateTotal("exp");
            calculateTotal("inc");
            //calculate the budget:income-expenses
            data.budget=data.totals.inc-data.totals.exp;
            //calculate the % of income we spent
            if(data.totals.inc>0){
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            //eg:expense=100 and income=200,so money spent is 50% i.e, equal to 100/200=0.5*100
            ///eg:expense=100 and income=300,so money spent is  i.e, equal to 100/300=0.3333*100
            //100 is what % of 300?formula
            }
            else{
                data.percentage=-1;
            }
        },
        calculatePercentage:function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },
        
        getPercentages:function(){
          var allPercentages=data.allItems.exp.map(function(cur){
            return cur.getPercentage();  
          }); 
            return allPercentages;
        },
        
        getBudget:function(){
          return {
              budget:data.budget,
              totalInc:data.totals.inc,
              totalExp:data.totals.exp,
              percentage:data.percentage
          }  
        },
        testing:function(){
            //console.log(data);
        }
    };
    })();

var UIController=(function(){
    var newHTML,element;
    var DOMstrings={
        inputType:".add__type",
        inputDescription:".add__description",
        inputValue:".add__value",
        inputButton:".add__btn",
        incomeContainer:".income__list",
        expensesContainer:".expenses__list",
        budgetLabel:".budget__value",
        incomeLabel:".budget__income--value",
        expenseLabel:".budget__expenses--value",
        percentageLabel:".budget__expenses--percentage",
        container:".container",
        expensesPercLabel:".item__percentage",
        dateLabel:".budget__title--month"
    };
    
    
    var formatNumber=function(num,type){
            var int,dec;
            /*
            + or - before number
            exactly 2 decimal points
            comma seperating the thousands
            
            2310.4567--->*2,310.46
            */
            
            num=Math.abs(num);
            //method of number prototype.
            //toFixed() method converts a number into a string with specified no.of decimals.
            //eg:2310.4567--->*2310.46
            //(2.4567).toFixed(2)--->"2.46"
            //(2).toFixed(2)--->"2.00"
            num=num.toFixed(2);
            //splitting the number into int and dec
            var numSplit=num.split('.');
            int=numSplit[0];
            if(int.length>3){
                //int=int.substr(0,1)+","+int.substr(1,3);//input 2310,then output is 2,310
                int=int.substr(0,int.length-3)+","+int.substr(int.length-3,3);//input 23100,then output is 23,100
                    }
            dec=numSplit[1];
           return (type==='exp'?'-':'+')+' '+int+"."+dec;
        };
    
    var nodeListForEach=function(list,callback){
                for(var i=0;i<list.length;i++){
                    callback(list[i],i);
                }
            };  
       
 //reading input from html document.
    return {
        getInput:function(){
            return{
            type:document.querySelector(DOMstrings.inputType).value,//will be either inc or exp
            description:document.querySelector(DOMstrings.inputDescription).value,
            value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem:function(obj,type){
            //create HTML string with placeholder text
            if(type==="inc"){
            element=DOMstrings.incomeContainer;
             var html= '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type=="exp"){
            element=DOMstrings.expensesContainer;
            var html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //replace placeholder text with actual data
            newHTML=html.replace('%id%',obj.id);
            newHTML=newHTML.replace('%description%',obj.description);
            newHTML=newHTML.replace('%value%',formatNumber(obj.value,type));
            //Insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);//beforeend keyword inserts as child of .income__list
            
        },
        
        deleteListItems:function(selectorID){
            var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields:function(){
        var fields=document.querySelectorAll(DOMstrings.inputDescription+","+DOMstrings.inputValue);
            //The slice() method returns the selected elements in an array, as a new array object.
            var fieldsArr=Array.prototype.slice.call(fields);
            //The forEach() method calls a provided function once for each element in an array, in order.
            fieldsArr.forEach(function(current){
                current.value="";
                
            });
            fieldsArr[0].focus();
    },
        
        displayBudget:function(obj){
            var type;
            obj.budget>0?type="inc":type="exp";
            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,type);
            document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber(obj.totalExp,type);
            if(obj.percentage>0){
             document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+" %";
            }
            else{
                 document.querySelector(DOMstrings.percentageLabel).textContent="--";
            }
        },
        
        
        displayPercentages:function(percentages){
                

            var fields=document.querySelectorAll(DOMstrings.expensesPercLabel);
            //console.log(fields);
              /*
              var nodeListForEach=function(list,callback){
                for(var i=0;i<list.length;i++){
                    callback(list[i],i);
                }
            };  
       
              */
            nodeListForEach(fields,function(current,index){
                if(percentages[index]>0){
                current.textContent=percentages[index]+" %";
                }
                else{
                    current.textContent="--";
                }
            });
            
            
        },
        
        displayMonth:function(){
          var now=new Date();
            var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
            //eg:-var christmas=new Date(2017,11,25);
            var month=now.getMonth();
        var year=now.getFullYear();//returns year.
        document.querySelector(DOMstrings.dateLabel).textContent=months[month]+" "+year;
        },
        
        changedType:function(){
          var fields=document.querySelectorAll(DOMstrings.inputType+","+DOMstrings.inputDescription+","+DOMstrings.inputValue);
            nodeListForEach(fields,function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },
        
        
        getDOMstrings:function(){
            return DOMstrings;
        }
    };
})();


//APP CONTROLLER
var controller=(function(budgetCtrl,UIctrl){
    var setUpEventListeners=function(){
        var DOM=UIctrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener("click",ctrlAddItem);
    //Adding key press event listener.eg:-Pressing "ENTER" KEY.
    //making to work the key press event listener every where on the webpage.
    //KeyboardEvent is an UIEvent
    //keyCode of "ENTER" KEY IS 13 
    //keyCode may not support in some browsers,so for safe-side use which property also as shown below.
    //USE EVENT OR SHORTCUT--->e inside the function argument.
    document.addEventListener("keypress",function(event){
          if(event.keyCode===13||event.which===13){
            ctrlAddItem();
           //updatePercentages();
          }
    });
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
         document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changedType);
    };
    var updateBudget=function(){
         //claculate the budget.
        budgetCtrl.calculateBudget();
        //return the budget.
    var budget=budgetCtrl.getBudget();
        //Display the budget on the UI.
        //console.log(budget);
        
        UIctrl.displayBudget(budget);
    }
    
    
    var updatePercentages=function(){
        //calculate percentages.
        budgetCtrl.calculatePercentage();
        //read percentages from the UI controller.
        var percentages=budgetCtrl.getPercentages();
        //update the UI with the new percentages.
      // console.log(percentages);
        UIctrl.displayPercentages(percentages);
    };
    
    var ctrlAddItem=function(){
        //1.Get the field input data.
       var input=UIctrl.getInput();
        //console.log(input);
        if(input.description!==""&&!isNaN(input.value)&&input.value>0){
       //2.Add the item to the budget controller structure.
       var newItem=budgetCtrl.addItem(input.type,input.description,input.value);
       //3.Add the item to the UI.
       UIctrl.addListItem(newItem,input.type);
        //4.clearing the fields.
        UIctrl.clearFields();
        //5.calculate and update budget.
            updateBudget();
            //
            updatePercentages();
        }
    };
    var ctrlDeleteItem=function(event){
        var splitID,ID,type,itemID;
        //console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
       console.log(itemID);
        if(itemID){
            //inc-1
            
            splitID=itemID.split("-");
            type=splitID[0];
            ID=parseInt(splitID[1]);
            //1.Delete the item from data structrure.
            budgetCtrl.deletItem(type,ID);
            //2.delete the item from the ui.
            UIctrl.deleteListItems(itemID);
            //3.update and show the budget.
            updateBudget();
        
        }
    }
    
    return {
        init:function(){
            console.log("application has started");
            UIctrl.displayMonth();
            UIctrl.displayBudget({
                budget:0,
              totalInc:0,
              totalExp:0,
              percentage:-1
            });
            //alterbate way to set it to zero: document.querySelector(".budget__value").textContent="10";
            setUpEventListeners();
        }
    }
})(budgetController,UIController);
controller.init();