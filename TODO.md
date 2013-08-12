http://tdc-www.harvard.edu/catalogs/sao.html
for starts.

# Now

create a server for index.html -> needs localhost in order to load js and stuff.

Schedule and segment things that I have to do. Be more efficient at work so that you provision more time there for other things. Create less order, less high level spontaniety. More low level creativity.

Intersect other people's lives at all times -> bridges closeness. Consistance and non segmenting your position in their lives.



# Mathmatics



# i/o

hmm... this is scope creep. perhaps I should generate some data, grow influence, then do more?

perhaps do a non-reusable site. one off to spread data for particular uses.


# Visualization Platform
vector field
bargraph

allow callbacks on data like d3? -> abstract rendering


The goal is to detach the data layer from the visualization layer. The data layer should be completely constructable from a json file. Dependencies and visualization libraries should be jit loaded to accomidate the data file.

Design the compact json file. (modeled after html/xml tree)
Design the access protocol (modeled after d3).

o.select('root').selectAll('m').data([23,43,36,23]).enter();

{
    // metadata here


    data: [
        population: {
            '_meta': {
                'key': {
                    rel: 'city'...
                }
            }
            'ohio': 45;
            'le'
        }
    ],

    tranform: [

    ],

} -> binary for large data
either use arraybuffer or blob/filereader.

have the server automatically populate related data
i.e. city -> latitude/longitude, depending on what's necessary.

this can be done on the server and cached as well.