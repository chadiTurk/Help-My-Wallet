$( document ).ready(function() {
    
    var cryptoArray = [];
    var weightsArray = [];
    var valuesArray = [];
    var Item =  [];
    var finalItems = [];
    var knapsackSize;
    var startTime, endTime;
    
    /**
     * Sets default values for knapsack size, input weight/price and profit/value
     */

    document.getElementById("knapsackSize").defaultValue = 50;
    $(".inputWeight").val(5);
    $(".inputValue").val(5);

    /**
     * Each time the add a new item button is clicked, add a new item container
     */

    $("#btnAddNewItem").click(function(){

        $("#cardContainer").append('<div class="card"></div>');
        $('.card:last').append('<div class="deleteButton">X</div>');
        $('.card:last').append('<div class="card-body"></div>');
        $('.card-body:last').append('<p class="itemLabel"> Item </p>');
        $('.card-body:last').append('<label for="inputCryptoCurrency">Cryptocurrency</label>');
        $('.card-body:last').append('<input type="text" class="inputCryptoCurrency" placeholder="Bitcoin" > ');
        $('.card-body:last').append('<label for="inputWeight">Price</label>');
        $('.card-body:last').append('<input type="number" class="inputWeight" placeholder="10" min="1">');
        $('.card-body:last').append('<label for="inputValue">Profit</label>');
        $('.card-body:last').append('<input type="number" class="inputValue" placeholder="500" min="1"> ');
        
        $("#btnConfirmItems").css("display","block");
        
        deleteDiv();
        cardNumber++;
       
    });

    /**
     * Gathers all of the input values if all fields are not empty
     */

    $("#btnConfirmItems").click(function(){

        var crypto = "Crypto :{";
        var weights = "Price :{";
        var values = "Profit :{";
        var knapsack = "Maximum wallet budget : ";
        var emptyFieldsFound = false;
        $(".breakdownText").text(" ");

        cryptoArray = [];
        weightsArray = [];
        valuesArray = [];

        /**
         * Get the value of each input then add to their respective arrays.
         */
        
        $(".inputCryptoCurrency").each(function(){
            crypto += $(this).val();

            if($(this).val().length != 0 || $(this).val() != ""){
                cryptoArray.push($(this).val());
                crypto += ",";
                $(this).css("background-color","#FFFFFF");
            }
            else{
                $(this).css("background-color","#ff5465");
                emptyFieldsFound = true;
            }
                

        });

        $(".inputWeight").each(function(){

            if($(this).val().length != 0 || $(this).val() != ""){
                weightsArray.push(parseInt($(this).val()));
                weights += $(this).val();
                weights += ",";
                $(this).css("background-color","#FFFFFF");
            }
            else{
                $(this).css("background-color","#ff5465");
                emptyFieldsFound = true;
            }
        });

        $(".inputValue").each(function(){

            if($(this).val().length != 0 || $(this).val() != ""){
                valuesArray.push(parseInt($(this).val()));
                values += $(this).val();
                values += ",";
                $(this).css("background-color","#FFFFFF");
            }
            else{
                $(this).css("background-color","#ff5465");
                emptyFieldsFound = true;
            }

        });

        /**
         * This just removes the last ',' (comma)
         */

        crypto = crypto.slice(0, -1); 
        weights = weights.slice(0, -1); 
        values = values.slice(0, -1); 

        crypto += "}";
        weights += "}";
        values += "}";
        knapsack += $("#knapsackSize").val();

        $("#modalCrypto").text(crypto);
        $("#modalWeights").text(weights);
        $("#modalValues").text(values);
        $("#modalKnapsack").text(knapsack);
        $("#runTime").text(" ");
        
        /**
         * If there are empty input fields, don't show the modal and highlight the empty fields 
         */

        if(emptyFieldsFound == false){
            $("#errorMessage").css("display","none");
            $("#confirmModal").modal('toggle');
        }   
        else{
            $("#errorMessage").css("display","block");
        }

        $("#optimalResult").text("");
        $("#resultBreakdown").css("display","none");
        knapsackSize = parseInt($("#knapsackSize").val());

        checkIfEmptyFieldsExist();
        
     
    });

    /**
     * Displays the optimal profit possible after calling the knapsack algorithms
     */

    $("#btnCalculateDynamic").click(function(){

        start();
        $("#resultBreakdown").css("display","block");
        $("#breakdownHeaderText").text("Dynamic Solution Breakdown")
        var optimalResult =  knapsackDynamic(knapsackSize,weightsArray,valuesArray,weightsArray.length);
        $("#optimalResult").text(" The optimal profit for dynamic solution is : " + optimalResult);



        end();

        
    });

    $("#btnCalculateGreedy").click(function(){

        start();

        $("#resultBreakdown").css("display","block");
        $("#breakdownHeaderText").text("Greedy Solution Breakdown")
        var value =  knapsackGreedy(knapsackSize,cryptoArray,weightsArray,valuesArray,weightsArray.length);
        $("#optimalResult").text(" The optimal profit for greedy solution is : " + value);

        end();

        
    });


    /**
     * 
     * @param {int} capacity: Capacity of the knapsack/wallet
     * @param {int array} weightArray : Array containing the different weights/price
     * @param {int array} valueArray : Array containing the different values/profit
     * @param {int} n : Size of the array
     * 
     * Part of the implementation for this is attributed to : https://www.geeksforgeeks.org/printing-items-01-knapsack/
     */

    function knapsackDynamic(capacity,weightArray,valueArray,n)
    {   

        $(".breakdownText").text(" ");
        $("#breakdownHeader").css("display","block");
        document.getElementById('tableBody').textContent = '';

        let i, w;
        let K = new Array(n + 1);

        /**
         * Creates a two dimensional array K and initalizes all of the values to 0
         */

        for( i=0;i<K.length;i++)
        {
            K[i]=new Array(capacity+1);
            for(let j=0;j<capacity+1;j++)
            {
                K[i][j]=0;
            }
        }
   
        /**
         *  The values to be evaluated are stored in the two dimensional array K 
         */

        for (i = 0; i <= n; i++) {
            for (w = 0; w <= capacity; w++) {
                if (i == 0 || w == 0)
                    K[i][w] = 0;
                else if (weightArray[i - 1] <= w)
                    K[i][w] = Math.max(valueArray[i - 1] +
                        K[i - 1][w - weightArray[i - 1]],
                        K[i - 1][w]);
                else
                    K[i][w] = K[i - 1][w];
            }
        }
   
        /**
         * The optimal profit value is stored here
         */
        let res = K[n][capacity];
        w = capacity;

        /**
         * This prints the results in the table
         */

        for (i = n; i > 0 && res > 0; i--)
        {   
            
            /*
             * Checks wheter the item/cryptocurrency is included in the knapsack based on its weight, if it's 
             * included, append it to the table.
             */

            if (res == K[i - 1][w])
                continue;
            else {
   
                $("tbody").append('<tr> </tr>');
                $("tr:last").append('<td> </td>');
                $("td:last").text(cryptoArray[i-1]);

         
                $("tr:last").append('<td> </td>');
                $("td:last").text(weightArray[i - 1]);

                $("tr:last").append('<td> </td>');
                $("td:last").text(valueArray[i - 1]);

                $(".breakdownText:last").text(cryptoArray[i-1] + ": " + "(" + weightArray[i - 1] + "," + valueArray[i-1] + ")");
               console.log(cryptoArray[i-1] + ":" +  weightArray[i - 1] + " ");
               
                /**
                 * The result should be udpated based on the weight of the recently added 
                 * item/cryptocurrency by deducting it.
                 */
                res = res - valueArray[i - 1];
                w = w - weightArray[i - 1];
            }
        }
        return K[n][capacity];
    }

/**
 * 
 * @param {int} capacity: Capacity of the knapsack/wallet
 * @param {String array} cryptoArray: Array containing the different cryptocurrencies
 * @param {int array} weightArray : Array containing the different weights/price
 * @param {int array} valueArray : Array containing the different values/profit
 * @param {int} n : Size of the array
 */

    function knapsackGreedy(capacity,cryptoArray,weightArray,valueArray,n){

        $(".breakdownText").text(" ");
        $("#breakdownHeader").css("display","block");
        document.getElementById('tableBody').textContent = '';

        Item = [];
        finalItems = [];


        /**
         * Create an Item object array, each item contains the following values:
         * crypto: Name of the cryptocurrency
         * weight: Price/weight of the cryptocurrency
         * value: Profit/value of the cryptocurrency
         * ratio: The ratio of the profit/price
         */

        for(var i = 0 ;i<weightArray.length;i++){
            Item.push({
                crypto:cryptoArray[i],
                weight:weightArray[i],
                value:valueArray[i],
                ratio:valueArray[i]/weightArray[i]
            })
        }

        /**
         * This sorts the items in descending order based on their ratio, based on the documentation
         * for javascript, the sort algorithm uses quicksort under the hood which is O (n log n)
         */

        Item.sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio));

        var curWeight = 0;
        var finalvalue = 0.0;

        for (var i = 0; i < n; i++) {

            /**
             * If the capacity of the knapsack/wallet is not full yet, just add the item with the 
             * highest profit/price ratio (there are other variations of this such as sorting it based on
             * the highest value or lowest weight instead of a ratio, but the ratio yields better results)
             */
             
            if (curWeight + Item[i].weight <= capacity) {
                curWeight += Item[i].weight;
                finalvalue += Item[i].value;

                finalItems.push({
                    crypto:Item[i].crypto,
                    weight:Item[i].weight,
                    value:Item[i].value
                })
            }
     

        }

        /**
         * This adds the results to the table 
         */

        for(var i = 0; i< finalItems.length;i++){
            $("tbody").append('<tr> </tr>');
                $("tr:last").append('<td> </td>');
                $("td:last").text(finalItems[i].crypto);

         
                $("tr:last").append('<td> </td>');
                $("td:last").text(finalItems[i].weight);

                $("tr:last").append('<td> </td>');
                $("td:last").text(finalItems[i].value);

                $(".breakdownText:last").text(finalItems[i].crypto + ": " + "(" + finalItems[i].value + "," + finalItems[i].weight + ")");
               console.log(cryptoArray[i-1] + ":" +  weightArray[i - 1] + " ");
               
        }

        return finalvalue;
        
        
    }

    /**
     * Attaches a keyup listener to input fields which changes color once the user enters a character.
     */
    function checkIfEmptyFieldsExist(){
        var inputs = $("input");

        inputs.keyup(function() {
            $(this).css('background-color',"#FFFFFF");

        });
    }


    /**
     * This triggers the deletion of a card when the user clicks the 'X' button
     */

    function deleteDiv(){
        var deleteButtons = $(".deleteButton");

        deleteButtons.click(function(){
            $(this).parent().remove();

        if($('.card').length == 0){
            $("#btnConfirmItems").css('display','none');
        }
        });
        
        
    }

    deleteDiv();

    
    function start() {
        startTime = new Date();
      };
      
      function end() {
        endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms     
        // get seconds 
        var milliseconds = Math.round(timeDiff);

        $("#runTime").text("Runtime in milliseconds: " + milliseconds);
      }

    

});