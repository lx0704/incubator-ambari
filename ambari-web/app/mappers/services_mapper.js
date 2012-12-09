/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

App.servicesMapper = App.QuickDataMapper.create({
  model:App.Service,
  servicesSortOrder: [
    'HDFS',
    'MAPREDUCE',
    'HBASE',
    'HIVE',
    'OOZIE',
    'GANGLIA',
    'NAGIOS',
    'ZOOKEEPER',
    'PIG',
    'SQOOP'
  ],
  sortByOrder: function (sortOrder, array) {
    var sorted = [];
    for (var i = 0; i < sortOrder.length; i++)
      for (var j = 0; j < array.length; j++) {
        if (sortOrder[i] == array[j].id) {
          sorted.push(array[j]);
        }
      }
    return sorted;
  },
  config:{
    id:'ServiceInfo.service_name',
    service_name:'ServiceInfo.service_name',
    $work_status:'DEAD',
    $service_audit:[ 1, 2, 3 ],
    $alerts:[ 1, 2, 3 ],
    components_key:'components',
    components_type:'array',
    components:{
      item:'ServiceComponentInfo.component_name'
    },
    host_components:'host_components'
  },

  hdfsConfig:{
    version:'nameNodeComponent.ServiceComponentInfo.Version',
    name_node_id:'nameNodeComponent.host_components[0].HostRoles.host_name',
    sname_node_id:'snameNodeComponent.host_components[0].HostRoles.host_name',
    data_nodes:'data_nodes',
    name_node_start_time:'nameNodeComponent.ServiceComponentInfo.StartTime',
    jvm_memory_heap_used:'nameNodeComponent.host_components[0].metrics.jvm.memHeapUsedM',
    jvm_memory_heap_committed:'nameNodeComponent.host_components[0].metrics.jvm.memHeapCommittedM',
    live_data_nodes:'live_data_nodes',
    dead_data_nodes:'dead_data_nodes',
    decommision_data_nodes:'decommission_data_nodes',
    capacity_used:'nameNodeComponent.ServiceComponentInfo.CapacityUsed',
    capacity_total:'nameNodeComponent.ServiceComponentInfo.CapacityTotal',
    dfs_total_blocks:'nameNodeComponent.host_components[0].metrics.dfs.FSNamesystem.BlocksTotal',
    dfs_corrupt_blocks:'nameNodeComponent.host_components[0].metrics.dfs.FSNamesystem.CorruptBlocks',
    dfs_missing_blocks:'nameNodeComponent.host_components[0].metrics.dfs.FSNamesystem.MissingBlocks',
    dfs_under_replicated_blocks:'nameNodeComponent.host_components[0].metrics.dfs.FSNamesystem.UnderReplicatedBlocks',
    dfs_total_files:'nameNodeComponent.host_components[0].metrics.dfs.FSNamesystem.FilesTotal',
    upgrade_status:'nameNodeComponent.ServiceComponentInfo.UpgradeFinalized',
    safe_mode_status:'nameNodeComponent.ServiceComponentInfo.Safemode'
  },

  mapReduceConfig:{
    version:'jobTrackerComponent.ServiceComponentInfo.Version',
    job_tracker_id:'jobTrackerComponent.host_components[0].HostRoles.host_name',
    task_trackers:'task_trackers',
    job_tracker_start_time:'jobTrackerComponent.ServiceComponentInfo.StartTime',
    job_tracker_heap_used:'jobTrackerComponent.ServiceComponentInfo.HeapMemoryUsed',
    job_tracker_heap_max:'jobTrackerComponent.ServiceComponentInfo.HeapMemoryMax',
    alive_trackers:'alive_trackers',
    black_list_trackers:'black_list_trackers',
    gray_list_trackers:'gray_list_trackers',
    map_slots:'map_slots',
    reduce_slots:'reduce_slots',
    jobs_submitted:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.jobs_submitted',
    jobs_completed:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.jobs_completed',
    map_slots_occupied:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.occupied_map_slots',
    map_slots_reserved:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.reserved_map_slots',
    reduce_slots_occupied:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.occupied_reduce_slots',
    reduce_slots_reserved:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.reserved_reduce_slots',
    maps_running:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.running_maps',
    maps_waiting:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.waiting_maps',
    reduces_running:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.running_reduces',
    reduces_waiting:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.waiting_reduces',
    trackers_decommisioned:'jobTrackerComponent.host_components[0].metrics.mapred.jobtracker.trackers_decommissioned'
  },

  hbaseConfig:{
    version:'masterComponent.ServiceComponentInfo.Version',
    master_id:'masterComponent.host_components[0].HostRoles.host_name',
    region_servers:'region_servers',
    master_start_time:'masterComponent.ServiceComponentInfo.MasterStartTime',
    master_active_time:'masterComponent.ServiceComponentInfo.MasterActiveTime',
    average_load:'masterComponent.ServiceComponentInfo.AverageLoad',
    regions_in_transition:'regions_in_transition',
    revision:'masterComponent.ServiceComponentInfo.Revision',
    heap_memory_used:'masterComponent.ServiceComponentInfo.HeapMemoryUsed',
    heap_memory_max:'masterComponent.ServiceComponentInfo.HeapMemoryMax'
  },

  model2:App.Component,
  config2:{
    id:'ServiceComponentInfo.component_name',
    component_name:'ServiceComponentInfo.component_name',
    service_id:'ServiceComponentInfo.service_name',
    work_status:'host_components[0].HostRoles.state',
    host_id:'host_components[0].HostRoles.host_name',
    $decommissioned:false
  },
  model3:App.HostComponent,
  config3:{
    id:'id',
    work_status:'HostRoles.state',
    component_name:'HostRoles.component_name',
    host_id:'HostRoles.host_name',
    service_id:'component[0].ServiceComponentInfo.service_name'
  },

  map:function (json) {
    if (!this.get('model')) {
      return;
    }

    if (json.items) {
      var result = [];
      json.items.forEach(function (item) {
        var finalConfig = jQuery.extend({}, this.config);
        item.host_components = [];
        item.components.forEach(function (component) {
          component.host_components.forEach(function (host_component) {
            host_component.id = host_component.HostRoles.component_name + "_" + host_component.HostRoles.host_name;
            item.host_components.push(host_component.id);
          }, this)
        }, this);

        if (item && item.ServiceInfo && item.ServiceInfo.service_name == "HDFS") {
          // Change the JSON so that it is easy to map
          var hdfsConfig = this.hdfsConfig;
          item.components.forEach(function (component) {
            if (component.ServiceComponentInfo && component.ServiceComponentInfo.component_name == "NAMENODE") {
              item.nameNodeComponent = component;
              finalConfig = jQuery.extend(finalConfig, hdfsConfig);
              // Get the live, dead & decommision nodes from string json
              var liveNodesJson = App.parseJSON(component.ServiceComponentInfo.LiveNodes);
              var deadNodesJson = App.parseJSON(component.ServiceComponentInfo.DeadNodes);
              var decommisionNodesJson = App.parseJSON(component.ServiceComponentInfo.DecomNodes);
              item.live_data_nodes = [];
              item.dead_data_nodes = [];
              item.decommision_data_nodes = [];
              for (var ln in liveNodesJson) {
                item.live_data_nodes.push(ln);
              }
              for (var dn in deadNodesJson) {
                item.dead_data_nodes.push(dn);
              }
              for (var dcn in decommisionNodesJson) {
                item.decommision_data_nodes.push(dcn);
              }
            }
            if (component.ServiceComponentInfo && component.ServiceComponentInfo.component_name == "SECONDARY_NAMENODE") {
              item.snameNodeComponent = component;
            }
            if (component.ServiceComponentInfo && component.ServiceComponentInfo.component_name == "DATANODE") {
              if (!item.data_nodes) {
                item.data_nodes = [];
              }
              if (component.host_components) {
                component.host_components.forEach(function (hc) {
                  item.data_nodes.push(hc.HostRoles.host_name);
                });
              }
            }
          });
          // Map
          var finalJson = this.parseIt(item, finalConfig);
          finalJson.quick_links = [1, 2, 3, 4];
          result.push(finalJson);
          App.store.load(App.HDFSService, finalJson);
        } else if (item && item.ServiceInfo && item.ServiceInfo.service_name == "MAPREDUCE") {
          // Change the JSON so that it is easy to map
          var mapReduceConfig = this.mapReduceConfig;
          item.components.forEach(function (component) {
            if (component.ServiceComponentInfo && component.ServiceComponentInfo.component_name == "JOBTRACKER") {
              item.jobTrackerComponent = component;
              finalConfig = jQuery.extend(finalConfig, mapReduceConfig);
              // Get the live, gray & black nodes from string json
              item.map_slots = 0;
              item.reduce_slots = 0;
              var liveNodesJson = App.parseJSON(component.ServiceComponentInfo.AliveNodes);
              var grayNodesJson = App.parseJSON(component.ServiceComponentInfo.GrayListedNodes);
              var blackNodesJson = App.parseJSON(component.ServiceComponentInfo.BlackListedNodes);
              item.alive_trackers = [];
              item.gray_list_trackers = [];
              item.black_list_trackers = [];
              if (liveNodesJson != null) {
                liveNodesJson.forEach(function (nj) {
                  item.alive_trackers.push(nj.hostname);
                  if (nj.slots && nj.slots.map_slots)
                    item.map_slots += nj.slots.map_slots;
                  if (nj.slots && nj.slots.map_slots_used)
                    item.map_slots_used += nj.slots.map_slots_used;
                  if (nj.slots && nj.slots.reduce_slots)
                    item.reduce_slots += nj.slots.reduce_slots;
                  if (nj.slots && nj.slots.reduce_slots_used)
                    item.reduce_slots_used += nj.slots.reduce_slots_used;
                });
              }
              if (grayNodesJson != null) {
                grayNodesJson.forEach(function (nj) {
                  item.gray_list_trackers.push(nj.hostname);
                });
              }
              if (blackNodesJson != null) {
                blackNodesJson.forEach(function (nj) {
                  item.black_list_trackers.push(nj.hostname);
                });
              }
            }
            if (component.ServiceComponentInfo && component.ServiceComponentInfo.component_name == "TASKTRACKER") {
              if (!item.task_trackers) {
                item.task_trackers = [];
              }
              if (component.host_components) {
                component.host_components.forEach(function (hc) {
                  item.task_trackers.push(hc.HostRoles.host_name);
                });
              }
            }
          });
          // Map
          finalJson = this.parseIt(item, finalConfig);
          finalJson.quick_links = [5, 6, 7, 8, 9, 10, 11, 12];
          result.push(finalJson);
          App.store.load(App.MapReduceService, finalJson);
        } else if (item && item.ServiceInfo && item.ServiceInfo.service_name == "HBASE") {
          // Change the JSON so that it is easy to map
          var hbaseConfig = this.hbaseConfig;
          item.components.forEach(function (component) {
            if (component.ServiceComponentInfo && component.ServiceComponentInfo.component_name == "HBASE_MASTER") {
              item.masterComponent = component;
              finalConfig = jQuery.extend(finalConfig, hbaseConfig);
              var regionsArray = App.parseJSON(component.ServiceComponentInfo.RegionsInTransition);
              item.regions_in_transition = regionsArray == null ? 0 : regionsArray.length;
            }
            if (component.ServiceComponentInfo && component.ServiceComponentInfo.component_name == "HBASE_REGIONSERVER") {
              if (!item.region_servers) {
                item.region_servers = [];
              }
              if (component.host_components) {
                component.host_components.forEach(function (hc) {
                  item.region_servers.push(hc.HostRoles.host_name);
                });
              }
            }
          });
          // Map
          finalJson = this.parseIt(item, finalConfig);
          finalJson.quick_links = [13, 14, 15, 16, 17, 18];
          result.push(finalJson);
          App.store.load(App.HBaseService, finalJson);
        } else {
          result.push(this.parseIt(item, this.config));
        }
      }, this);




      result = this.sortByOrder(this.get('servicesSortOrder'), result);
      App.store.loadMany(this.get('model'), result);

      result = [];
      json.items.forEach(function (item) {
        item.components.forEach(function (component) {
          result.push(this.parseIt(component, this.config2));
        }, this)
      }, this);

      App.store.loadMany(this.get('model2'), result);

      result = [];
      json.items.forEach(function (item) {
        item.components.forEach(function (component) {
          component.host_components.forEach(function (host_component) {
            result.push(this.parseIt(host_component, this.config3));
          }, this)
        }, this)
      }, this);
      App.store.loadMany(this.get('model3'), result);
    }
  }
});
