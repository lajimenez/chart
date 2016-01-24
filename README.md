# Chart documentation

This project is just an example what you can do with the 'rock.js' framework.
Anyway, if you need a basic bar chart component, you can use it (it works!)

### How to use in your project

To use 'chart' in your project, you have to include the script 'chart.min.js' (that you can find [here](https://lajimenez.github.com/chart/release/chart.min.js)) and the script containing the 'rock.js' framework  (that you can find [here](https://lajimenez.github.com/rock.js/release/rock.r1.min.js))
Remember that you have to add rock script first!
You can find an example to how to initialize a chart in the file 'src/test/init.js'.
For more information about the options you can set, please see the JSDoc for the 'chart.Data' class (you can find the JSDoc [here](https://lajimenez.github.com/chart/jsdoc/symbols/chart.Data.html))

### Demo

To see chart demo running click [here](https://lajimenez.github.com/chart/demo)

### Development

The project has been 'mavenized' so if you are familiar with maven you shouldn't have problems with the project folder structure. If not, you can found maven tutorials anyplace :P
At this moment, you will have to revise the code yourself as there is no technical documentation.

### How to generate JSDoc and minified version of chart

Open the terminal and execute:
```Batchfile
mvn clean compile jstools:jsdoc
```