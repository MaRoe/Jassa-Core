(function() {

	// TODO Differntiate between developer utils and user utils
	// In fact, the latter should go to the facade file
	
	var sparql = Jassa.sparql; 

	var ns = Jassa.sponate;
	
	ns.ServiceSponateSparqlHttp = Class.create({
		initialize: function(rawService) {
			this.rawService = rawService;
		},
		
		execSelect: function(query, options) {
			var promise = this.rawService.execSelect(query, options);
			
			var result = promise.pipe(function(json) {
				var bindings = json.results.bindings;

				var tmp = bindings.map(function(b) {
					//console.log('Talis Json' + JSON.stringify(b));
					var bindingObj = sparql.Binding.fromTalisJson(b);
					//console.log('Binding obj: ' + bindingObj);
					return bindingObj;					
				});
				
				var it = new ns.IteratorArray(tmp);
				
				//console.log()
				
				return it;
			});
			
			return result;
		}
	});

	
	/**
	 * A factory for backend services.
	 * Only SPARQL supported yet.
	 * 
	 */
	ns.ServiceUtils = {
	
		createSparqlHttp: function(serviceUrl, defaultGraphUris, httpArgs) {
		
			var rawService = new sparql.SparqlServiceHttp(serviceUrl, defaultGraphUris, httpArgs);
			var result = new ns.ServiceSponateSparqlHttp(rawService);
			
			return result;
		}	
	};
	
	
	/**
	 * Utility class to create an iterator over an array.
	 * 
	 */
	ns.IteratorArray = function(array, offset) {
		this.array = array;
		this.offset = offset ? offset : 0;
	};
	
	ns.IteratorArray.prototype = {
		hasNext: function() {
			var result = this.offset < this.array.length;
			return result;
		},
		
		next: function() {
			var hasNext = this.hasNext();
			
			var result;
			if(hasNext) {			
				result = this.array[this.offset];
				
				++this.offset;
			}
			else {
				result = null;
			}
			
			return result;
		}		
	};
	

	/*
	ns.AliasedElement = Class.create({
		initialize: function(element, alias) {
			this.element = element;
			this.alias = alias;
		},
		
		getElement: function() {
			return this.element;
		},
		
		getAlias: function() {
			return this.alias;
		},
		
		toString: function() {
			return '' + this.element + ' As ' + this.alias;
		}
	});
	*/
	
	/**
	 * A convenient facade on top of a join builder
	 * 
	 */
	ns.JoinNode = Class.create({
		initialize: function(joinBuilder, alias) {
			this.joinBuilder = joinBuilder;
			this.alias = alias;
		},
		
		getElement: function() {
			this.joinBuilder.getElementByAlias(this.alias);
		},
		
		// Returns all join node object 
		// joinBuilder = new joinBuilder();
		// node = joinBuilder.getRootNode();
		// node.join([?s], element, [?o]);
		//    ?s refers to the original element wrapped by the node
		//    ?o also refers to the original element of 'element'
		// 
		// joinBuilder.getRowMapper();
		// joinBuilder.getElement();
		getJoinNodes: function() {
			
		},
		
		// Keeps track of how to map back and forth by taking the alias into account
		join: function(sourceVars, targetElement, targetVars) {
			
			// Maps original var names to new ones
			var varMap = new ns.HashBidiMap();
			
			if(sourceColumns.length != targetColumns.length) {
				console.log('[ERROR] Cannot join on different number of columns');
				throw 'Bailing out';
			}
			
			var sourceElement = this.getElement();
			
			var c = sparql.ElementUtils.makeElementDistinct(a, b);
			console.log('distinct: ' + c.element, c.map);
			
			var bVars = b.getVarsMentioned();
			_.each(bVars, function(v) {
				var r = c.map[v.getName()];
				varMap.put(v, r)
			});
			
			//var rename = 

			// Rename the join columns of b so that they equal those of a
			for(var i = 0; i < sourceVars.length; ++i) {
				var sourceVar = sourceVars[i];
				var targetVar = targetVars[i];

				rename[targetVar.getName()] = sourceVar;
			}

			var fnSubst = function(v) {
				var result = rename[v.getName()];
				return result;
			};
			
			var d = c.copySubstitute(fnSubst);
			
			
			
		},
		
		//leftJoin: 
		
	});
	
	/**
	 * a: castle
	 * 
	 * 
	 * b: owners
	 * 
	 * 
	 */
	ns.JoinBuilderElement = Class.create({
		initialize: function() {
			this.aliasGenerator = new ns.GenSym('a');
			this.varAliasMap = new ns.VarAliasMap();
			this.aliasToElement = new ns.MapList(); 
		},
		
		// 
		add: function(aliasFrom, aliasTo) {
			
		},
		
		get: function() {
			
		}
	});

	ns.fnNodeEquals = function(a, b) { return a.equals(b); };

	/*
	 * We need to map a generated var back to the alias and original var
	 * newVarToAliasVar:
	 * {?foo -> {alias: 'bar', var: 'baz'} }
	 * 
	 * We need to map and alias and a var to the generater var
	 * aliasToVarMap
	 * { bar: { baz -> ?foo } }
	 *
	 * 
	 * 
	 * 
	 */
	ns.VarAliasMap = Class.create({
		initialize: function() {
			// newVarToOrig
			this.aliasToVarMap = new ns.HashMap(nsNodeEquals)
			this.newVarToAliasVar = new ns.HashMap(nsNodeEquals);
		},
		
		put: function(origVar, alias, newVar) {
			this.newVarToAliasVar.put(newVar, {alias: alias, v: origVar});
			
			var varMap = this.aliasToBinding[alias];
			if(varMap == null) {
				varMap = new ns.BidiHashMap();
				this.aliasToVarMap[alias] = varMap;
			}
			
			varMap.put(newVar, origVar);
		},
		
		getOrigAliasVar: function(newVar) {
			var entry = this.newVarToAliasVar.get(newVar);
			
			var result = entry == null ? null : entry;
		},
		
		getVarMap: function(alias) {
		}
	});
	
	
	ns.JoinElement = Class.create({
		initialize: function(element, varMap) {
			this.element = element;
		}
		
	});


	ns.JoinUtils = {
		/**
		 * Create a join between two elements 
		 */
		join: function(aliasEleA, aliasEleB, joinVarsB) {
			//var aliasA = aliasEleA. 
			
			var varsA = eleA.getVarsMentioned();
			var varsB = eleB.getVarsMentioned();
			
			
		},
			
		
		
		/**
		 * This method prepares all the joins and mappings to be used for the projects
		 * 
		 * 
		 * 
		 * transient joins will be removed unless they join with something that is
		 * not transient
		 * 
		 */
		createMappingJoin: function(context, rootMapping) {
			var generator = new sparql.GenSym('a');
			var rootAlias = generator.next();

			// Map<String, MappingInfo>
			var aliasToState = {};
			
			// ListMultimap<String, JoinInfo>
			var aliasToJoins = {};
		
			
			aliasToState[rootAlias] = {
				mapping: rootMapping,
				aggs: [] // TODO The mapping's aggregators
			};
			
			var open = [a];
			
			while(open.isEmpty()) {
				var sourceAlias = open.shift();
				
				var sourceState = aliasToState[sourceAlias];
				var sourceMapping = sourceState.mapping;
				
				ns.ContextUtils.resolveMappingRefs(this.context, sourceMapping);
				
				var refs = mapping.getPatternRefs(); 

				// For each reference, if it is an immediate join, add it to the join graph
				// TODO And what if it is a lazy join??? We want to be able to batch those.
				_(refs).each(function(ref) {
					var targetMapRef = ref.getTargetMapRef();
					
					var targetAlias = generator.next();
					
					aliasToState[targetAlias] = {
						mapping: targetMapping	
					};
				
					var joins = aliasToJoins[sourceAlias];
					if(joins == null) {
						joins = [];
						aliasToJoins[sourceAlias] = joins;
					}
					
					var join = {
						targetAlias: targetAlias,
						isTransient: true
					};
					
					joins.push(join);
				});
				
				
				var result = {
					aliasToState: aliasToState, 
					aliasToJoins: aliasToJoins
				};
				
				return result;
			}
		}
			
	};

	
	ns.GraphItem = Class.create({
		initialize: function(graph, id) {
			this.graph = graph;
			this.id = id;
		},
		
		getGraph: function() {
			return this.graph;
		},
		
		getId: function() {
			return this.id;
		}
	});


	ns.Node = Class.create(ns.GraphItem, {
		initialize: function($super, graph, id) {
			$super(graph, id);
		},
		
		getOutgoingEdges: function() {
			var result = this.graph.getEdges(this.id);
			return result;
		}
	});

	
	ns.Edge = Class.create({
		
		initialize: function(graph, id, nodeIdFrom, nodeIdTo) {
			this.graph = graph;
			this.id = id;
			this.nodeIdFrom = nodeIdFrom;
			this.nodeIdTo = nodeIdTo;
		},
		
		getNodeFrom: function() {
			var result = this.graph.getNode(this.nodeIdFrom);
			return result;
		},
		
		getNodeTo: function() {
			var result = this.graph.getNode(this.nodeIdTo);
			return result;			
		}

	});
	

	/**
	 * 
	 */
	ns.Graph = Class.create({
		initialize: function(fnCreateNode, fnCreateEdge) {
			this.fnCreateNode = fnCreateNode;
			this.fnCretaeEdge = fnCreateEdge;
			
			this.idToNode = {};
			
			// {v1: {e1: data}}
			// outgoing edges
			this.nodeIdToEdgeIdToEdge = {};
			this.idToEdge = {};

			this.nextNodeId = 1;
			this.nextEdgeId = 1;
		},
		
		createNode: function(/* arguments */) {
			var nodeId = '' + (++this.nextNodeId);
			
			var tmp = Array.prototype.slice.call(arguments, 0);
			var xargs = [this, nodeId].concat(tmp);
			
			var result = this.fnCreateNode.apply(this, xargs);
			this.idToNode[nodeId] = result;
			
			return result;
		},
		
		createEdge: function(nodeIdFrom, nodeIdTo /*, arguments */) {
			var edgeId = '' + (++this.nextEdgeId);
			
			var tmp = Array.prototype.slice.call(arguments, 0);
			// TODO Maybe we should pass the nodes rather than the node ids
			var xargs = [graph, nodeIdFrom, nodeIdTo].concat(tmp);

			
			var result = this.fnEdgeNode.apply(this, xargs);
			
			var edgeIdToEdge = this.nodeIdToEdgeIdToEdge[edges];
			if(edgeIdToEdge == null) {
				edgeIdToEdge = {};
				this.nodeIdToEdgeIdToEdge = edgeIdToEdge; 
			}
			
			edgeIdToEdge[edgeId] = result;
			this.idToEdge[edgeId] = result;
			
			
			return result;
		}		
		
	});
	
	ns.NodeJoinElement = Class.create(ns.Node, {
		initialize: function($super, graph, nodeId, element, alias) {
			$super(graph, nodeId); 

			this.element = element; // TODO ElementProvider?
			this.alias = alias;
		},
		
		getElement: function() {
			return this.element;
		},
		
		getAlias: function() {
			return this.alias;
		}		
	});

	
	ns.fnCreateMappingJoinNode = function(graph, nodeId) {
		console.log('Node arguments:', arguments);
		return new ns.MappingJoinNode(graph, nodeId);
	};


	ns.fnCreateMappingEdge = function(graph, edgeId) {
		return new ns.MappingJoinEdge(graph, edgeId);
	};


	ns.JoinGraphElement = Class.create(ns.Graph, {
		initialize: function($super) {
			$super(ns.fnCreateMappingJoinNode, ns.fnCreateMappingEdge);
		}
	});
	
	
	/**
	 * This row mapper splits a single binding up into multiple ones
	 * according to how the variables are mapped by aliases.
	 * 
	 * 
	 */
	ns.RowMapperJoin = Class.create({
		initialize: function(varAliasMap) {
			this.varAliasMap = varAliasMap;
		},
		
		/**
		 * 
		 * Returns a map from alias to bindings
		 * e.g. { a: binding, b: binding}
		 */
		map: function(binding) {
			//this.varAliasMap
			
			var vars = binding.getVars();
			
			var result = {};
			
			var varAliasMap = this.varAliasMap;
			_(vars).each(function(v) {
				
				var node = binding.get(v);
				
				var aliasVar = varAliasMap.getOrigAliasVar(v);
				var ov = aliasVar.v;
				var oa = aliasVar.alias;
				
				var resultBinding = result[oa];
				if(resultBinding == null) {
					resultBinding = new ns.Binding();
					result[oa] = resultBinding;
				}
				
				resultBinding.put(ov, node);
			});
			
			
			return result;
		}
	});
	

	ns.MappingJoinEdge = Class.create(ns.Edge, {
		initialize: function($super, graph, edgeId) {
			$super(graph, graph, edgeId); 
		}
	});

	
	
})();

