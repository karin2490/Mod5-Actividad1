const express=require('express');  //import express from 'express';
const app=express();
const employees=require('./data/employees.json');
app.use(express.json());



app.get("/api/employees", (req, res) => {   
    if (req.query!=null && Object.keys(req.query).length > 0){
        // Ejercicio 2
        if (req.query.page!=null){
            const page = parseInt(req.query.page);
             
            //Ejercicio 3
            if(page=="N"){
                const page = parseInt(req.query.page);
                const pageSize = 2;
                const startIndex = 2 * (page - 1);
                const endIndex = startIndex + pageSize;
                const slicedData = employees.slice(startIndex, endIndex);
                res.json({slicedData});
            }else{
                if (page < 1) {
                    return res.status(400).json({ error: 'Página inválida' });
                  } 
                 
                  const pageSize = 2;
                  const startIndex = (page - 1) * pageSize;
                  const endIndex = Math.min(startIndex + pageSize, employees.length); // Asegurar que endIndex no supere la longitud del array
                   slicedData = employees.slice(startIndex, endIndex);
                  res.json({slicedData});
            }           
        }      

        //Ejercicio 5
        if (req.query.user!=null && req.query.user === 'true'){      
            const filteredEmployees=employees.filter(e => e.privileges == "user");
            res.json(filteredEmployees);
        }
        //Ejericio 7
        if (req.query.badges!=null && req.query.badges != ""){ 
            const badges = req.query.badges;  
            const filteredEmployees=employees.filter(e => e.badges.includes(badges));          
            res.json({filteredEmployees});
        }
    }
    else{
        // Ejercicio 1
        res.json(employees);
    }
    
});

// Ejercicio 4
app.get('/api/employees/oldest', (req, res) => {
    const oldestEmployee = employees.reduce((oldest, employee) => {
        return (oldest.age || 0) > employee.age ? oldest : employee;
    }, {});
    res.json(oldestEmployee);
});

//Ejercicio 6
app.post('/api/employees', (req, res) => {
    const newEmployee = req.body;   
    if (validateEmployee(newEmployee)) {
        employees.push(newEmployee);
        console.log('employees',employees);
        res.status(201).json(newEmployee);
    } else {
        res.status(400).json({ code: "bad_request" });
    }
});



//Ejercicio 8
app.get('/api/employees/:name', (req, res) => {
    const { name } = req.params;
    const employee = employees.find(e => e.name === name);
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ code: "not_found" });
    }
});

app.listen(8000,()=>{
    console.log('Server is running on port 8000');
});


function validateEmployee(employee) {
    const phoneSchema = {
        personal: 'string',
        work: 'string',
        ext: 'string',
    };

    const favoriteSchema = {
        artist: 'string',
        food: 'string',
    };

    const pointSchema = {
        points: 'number',
        bonus: 'number',
    };

    // Verifica que todos los campos esperados existan y sean del tipo correcto
    if (typeof employee.name !== 'string' ||
        typeof employee.age !== 'number' ||
        !validateSchema(employee.phone, phoneSchema) ||
        employee.privileges !== 'user' && employee.privileges !== 'admin' ||
        !validateSchema(employee.favorites, favoriteSchema) ||
        !Array.isArray(employee.finished) || !employee.finished.every(num => typeof num === 'number') ||
        !Array.isArray(employee.badges) || !employee.badges.every(badge => typeof badge === 'string') ||
        !Array.isArray(employee.points) || !employee.points.every(point => validateSchema(point, pointSchema))
    ) {
        return false;
    }

    return true;
}

function validateSchema(object, schema) {
    return Object.keys(schema).every(key => typeof object[key] === schema[key]);
}
