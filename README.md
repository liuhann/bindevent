 
 
 ## Install with `npm`:

```sh
npm i --save bind-on-events
```

## How to use

**jQuery is required.**

```html
    <a onClick="letSee(1,2)">click and see</a>
```

should require you define letSee function as scope. In jquery, you can bind click event to your function like this

```javascript
    $('a').on('click', function() {
        
    });
```

so with bind-on-events, you can do it like this 


```javascript
    
    var bindEvents = require(' bind-on-events');
    var service = {
        letSee: function(a, b)  {
            
        }
    }
    
    bindEvents($('a'), service);
```

and html like this 

```html
    <a xbn-on-click="letSee(1,2)">click and see</a>
```

## Event supported

1. xbn-on-click 
2. xbn-on-blur  
3. xbn-on-enter 
4. xbn-on-change 


 

 
 