javascript:"use strict";(()=>{function de(){return new le}var le=class{constructor(e){this.activeFormOptionSetProvider=e;this.contextPromise=null}async getContext(){return this.contextPromise||(this.contextPromise=this.detectContext()),this.contextPromise}async retrieveEntityMetadata(e){let n=await this.getContext(),t=`EntityDefinitions(LogicalName='${G(e)}')?$select=MetadataId,LogicalName,EntitySetName,DisplayName,DisplayCollectionName,Description,PrimaryIdAttribute,PrimaryNameAttribute,ObjectTypeCode,IsRenameable&$expand=Attributes($select=MetadataId,LogicalName,SchemaName,DisplayName,Description,AttributeType,AttributeOf,IsLogical,IsValidForRead,IsValidForCreate,IsValidForUpdate,IsValidForAdvancedFind,IsRenameable),ManyToOneRelationships($select=SchemaName,ReferencingEntity,ReferencedEntity,ReferencingAttribute,ReferencedAttribute),OneToManyRelationships($select=SchemaName,ReferencingEntity,ReferencedEntity,ReferencingAttribute,ReferencedAttribute)`,i=await N(n,t,"GET");return this.mergeActiveFormOptionSetMetadata(e,i),i}mergeActiveFormOptionSetMetadata(e,n){let t=n.Attributes?.value;!Array.isArray(t)||t.length===0||this.mergeFormOptionSetMetadata(e,t)}mergeFormOptionSetMetadata(e,n){let t=this.getActiveFormOptionSets(e),i=new Map(n.map(o=>[String(o.LogicalName||o.logicalName||"").toLowerCase(),o]));t.forEach(o=>{let r=i.get(String(o.name||"").toLowerCase()),s=o.options||[];!r||s.length===0||ht(r)>=s.length||(r.OptionSet={Options:bt(s)})})}getActiveFormOptionSets(e){let n=this.activeFormOptionSetProvider?.(e);if(n)return n;let t=I(),i=t?.Page?.data?.entity?.getEntityName?.()?.toLowerCase(),o=t?.Page?.ui?.controls;if(i!==e.toLowerCase()||!o?.forEach)return[];let r=[];return o.forEach(s=>{let l=s.getControlType?.();if(l!=="optionset"&&l!=="multiselectoptionset")return;let u=s.getAttribute?.()?.getOptions?.()||[];u.length>0&&r.push({name:s.getName?.()||"",options:u})}),r}async retrieveOptionAttributeMetadata(e,n){let t=["PicklistAttributeMetadata","MultiSelectPicklistAttributeMetadata","StateAttributeMetadata","StatusAttributeMetadata","BooleanAttributeMetadata"];return(await Promise.all(t.map(async o=>{let r=`EntityDefinitions(LogicalName='${G(n)}')/Attributes/Microsoft.Dynamics.CRM.${o}`,s=[r,`${r}?$select=LogicalName,AttributeOf,IsLogical,IsValidForAdvancedFind&$expand=OptionSet`,`${r}?$select=LogicalName,AttributeOf,IsLogical,IsValidForAdvancedFind&$expand=GlobalOptionSet`],l=[];for(let u of s)try{let p=await N(e,u,"GET"),c=Array.isArray(p.value)?p.value:[];if(c.some(se))return c;l.length===0&&(l=c)}catch{}return l}))).flat()}async retrieveSingleOptionAttributeMetadata(e,n,t,i){let o=i==="state"?"StateAttributeMetadata":i==="status"?"StatusAttributeMetadata":i==="boolean"?"BooleanAttributeMetadata":i==="multiselectpicklist"?"MultiSelectPicklistAttributeMetadata":"PicklistAttributeMetadata",r=i==="picklist"||i==="multiselectpicklist"?["OptionSet","GlobalOptionSet"]:["OptionSet"],s=`EntityDefinitions(LogicalName='${G(n)}')`,l=`${s}/Attributes(LogicalName='${G(t)}')/Microsoft.Dynamics.CRM.${o}`,u=`${s}/Attributes/Microsoft.Dynamics.CRM.${o}`,p=[l,...r.flatMap(c=>[`${u}?$filter=LogicalName%20eq%20'${G(t)}'`,`${l}?$select=LogicalName,AttributeOf,IsLogical,IsValidForAdvancedFind&$expand=${c}`,`${u}(LogicalName='${G(t)}')?$select=LogicalName,AttributeOf,IsLogical,IsValidForAdvancedFind&$expand=${c}`,`${u}?$select=LogicalName,AttributeOf,IsLogical,IsValidForAdvancedFind&$filter=LogicalName%20eq%20'${G(t)}'&$expand=${c}`])];for(let c of p)try{let m=await N(e,c,"GET"),g=gt(m);if(!g)continue;let h=await this.hydrateOptionSetMetadata(e,g);if(h&&se(h))return h}catch{}return null}async retrieveStringMapOptionMetadata(e,n,t,i){let o=Number(e.languageId||1033)||1033,r=re(n),s=re(i),l=[`attributename eq '${s}' and objecttypecode eq '${r}' and langid eq ${o}`,t?`attributename eq '${s}' and objecttypecode eq ${t} and langid eq ${o}`:"",`attributename eq '${s}' and objecttypecode eq '${r}'`,t?`attributename eq '${s}' and objecttypecode eq ${t}`:""].filter(Boolean);for(let u of l){let p=`stringmaps?$select=attributevalue,value,attributename,objecttypecode,langid&$filter=${u.replace(/ /g,"%20")}`;try{let c=await N(e,p,"GET"),m=Array.isArray(c.value)?c.value:[],g=ft(m);if(g.length>0)return{OptionSet:{Options:g}}}catch{}}return null}async hydrateOptionSetMetadata(e,n){let t=n.GlobalOptionSet||n.globalOptionSet;if(!t||se(n))return n;let i=await this.retrieveGlobalOptionSetMetadata(e,t);return i?{...n,GlobalOptionSet:{...t,...i}}:n}async retrieveGlobalOptionSetMetadata(e,n){let t=String(n.Name||n.name||""),i=E(String(n.MetadataId||n.metadataId||"")),o=re(t),r=[t?`GlobalOptionSetDefinitions(Name='${o}')/Microsoft.Dynamics.CRM.OptionSetMetadata`:"",t?`GlobalOptionSetDefinitions(Name='${o}')/Microsoft.Dynamics.CRM.BooleanOptionSetMetadata`:"",i?`GlobalOptionSetDefinitions(${i})/Microsoft.Dynamics.CRM.OptionSetMetadata`:"",i?`GlobalOptionSetDefinitions(${i})/Microsoft.Dynamics.CRM.BooleanOptionSetMetadata`:"",t?`GlobalOptionSetDefinitions(Name='${o}')`:""].filter(Boolean);for(let s of r)try{let l=await N(e,s,"GET");if(ce(l.Options||l.options))return l}catch{}return null}webApiRequest(e,n,t,i){return this.getContext().then(o=>N(o,e,n,t,void 0,i))}async getCurrentRecordContext(){let n=I()?.Page,t=n?.data?.entity?.getEntityName?.()||"",i=[];return n?.ui?.controls?.forEach?.(o=>{try{let r=o?.getName?.();if(!r)return;let s=o.getVisible?.()!==!1;i.push({logicalName:r,label:o.getLabel?.()||r,controlType:o.getControlType?.(),visible:s,highlightable:s&&!!ve(r)})}catch{}}),{entityLogicalName:t,recordId:E(n?.data?.entity?.getId?.()||""),recordTitle:n?.data?.entity?.getPrimaryAttributeValue?.()||"",formLabel:n?.ui?.formSelector?.getCurrentItem?.()?.getLabel?.()||"",formId:E(n?.ui?.formSelector?.getCurrentItem?.()?.getId?.()||""),fields:i}}async highlightField(e){let n=String(e||"").toLowerCase(),i=I()?.Page?.getControl?.(n);try{i?.setFocus?.(),await new Promise(l=>window.setTimeout(l,250))}catch{}let o=ve(n);if(!o)return{found:!1,message:`${n} is not on the current form or is hidden.`};o.scrollIntoView({block:"center",inline:"nearest",behavior:"smooth"});let r=o.style.outline,s=o.style.boxShadow;return o.style.outline="3px solid #f2c94c",o.style.boxShadow="0 0 0 4px rgba(242, 201, 76, 0.35)",window.setTimeout(()=>{o.style.outline=r,o.style.boxShadow=s},3500),{found:!0,message:`${n} highlighted on the form.`}}async retrieveMultipleRecords(e,n,t=50,i){let o=I();if(o?.WebApi?.retrieveMultipleRecords){let p=await(n.trim().toLowerCase().startsWith("?fetchxml=")&&o.WebApi.online?.retrieveMultipleRecords?o.WebApi.online.retrieveMultipleRecords.bind(o.WebApi.online):o.WebApi.retrieveMultipleRecords.bind(o.WebApi))(e,n,t);return{...p,nextLink:p.nextLink||p["@odata.nextLink"],fetchXmlPagingCookie:p.fetchXmlPagingCookie||p.FetchXmlPagingCookie}}if(!i)throw new Error(`Xrm.WebApi is unavailable and no entity set name was supplied for ${e}.`);let r=await this.getContext(),s=await N(r,`${i}${ut(n)}`,"GET",void 0,t);return{entities:s.value||[],nextLink:s["@odata.nextLink"],fetchXmlPagingCookie:s.fetchXmlPagingCookie||s["@Microsoft.Dynamics.CRM.fetchxmlpagingcookie"]}}async createRecord(e,n,t){let i=I();if(i?.WebApi?.createRecord){let u=await i.WebApi.createRecord(e,n);return{id:E(u.id)}}let o=await this.getContext(),r=t||`${e}s`,s=await N(o,r,"POST",n);return{id:yt(s)}}async updateRecord(e,n,t,i){let o=I();if(o?.WebApi?.updateRecord){await o.WebApi.updateRecord(e,E(n),t);return}let r=await this.getContext(),s=i||`${e}s`;await N(r,`${s}(${E(n)})`,"PATCH",t)}async deleteRecord(e,n,t){let i=I();if(i?.WebApi?.deleteRecord){await i.WebApi.deleteRecord(e,E(n));return}let o=await this.getContext(),r=t||`${e}s`;await N(o,`${r}(${E(n)})`,"DELETE")}async openPersonalView(e,n){let t=await this.getContext(),i=mt(t,e,n),o=I();if(o?.Navigation?.navigateTo)try{await o.Navigation.navigateTo({pageType:"entitylist",entityName:e,viewId:E(n),viewType:"userquery"});return}catch{window.location.assign(i);return}window.location.assign(i)}async detectContext(){let e=I(),n=e?.Utility?.getGlobalContext?.(),t=await n?.getCurrentAppProperties?.().catch(()=>{});return{clientUrl:dt(n?.getClientUrl?.()||e?.Page?.context?.getClientUrl?.()||window.location.origin),environmentName:n?.organizationSettings?.uniqueName||t?.displayName||t?.uniqueName,userId:E(n?.userSettings?.userId||e?.Page?.context?.getUserId?.()||""),appId:t?.appId,version:n?.getVersion?.()||e?.Page?.context?.getVersion?.(),languageId:n?.userSettings?.languageId}}};async function N(a,e,n,t,i,o){let r=pt(a.version),s=null;for(let l of r){let u=await fetch(`${a.clientUrl}/api/data/${l}/${e}`,{method:n,credentials:"include",cache:"no-store",headers:{Accept:"application/json","Content-Type":"application/json; charset=utf-8","OData-MaxVersion":"4.0","OData-Version":"4.0",Prefer:["odata.include-annotations=*",i?`odata.maxpagesize=${i}`:""].filter(Boolean).join(","),...o||{}},body:t?JSON.stringify(t):void 0});if(u.ok){let c=await u.text();if(!c){let m=u.headers.get("OData-EntityId");return m?{"@odata.id":m}:{}}return JSON.parse(c)}let p=await u.text();if(s=new Error(wt(p)||`Dataverse Web API returned HTTP ${u.status}.`),u.status!==404)break}throw s||new Error("Dataverse Web API request failed.")}function I(){let a=window.Xrm;try{let e=window.CrmPowerPane?.TargetFrame?.GetXrm?.();return window.CrmPowerPane?.FieldEditor?.GetCurrentXrm?.(e||a)||e||a}catch{return a}}function dt(a){return String(a||"").replace(/\/+$/,"")}function E(a){return String(a||"").replace(/[{}]/g,"")}function ut(a){let e=a.match(/^\?fetchxml=(.*)$/i);if(!e)return a;let n=e[1]||"";return n.trim().startsWith("<")?`?fetchXml=${encodeURIComponent(n)}`:a}function G(a){return String(a||"").replace(/'/g,"''").toLowerCase()}function re(a){return String(a||"").replace(/'/g,"''")}function pt(a){let e=new Set,n=String(a||"").match(/^(\d+)\.(\d+)/);return n&&e.add(`v${n[1]}.${n[2]}`),["v9.2","v9.1","v9.0","v8.2"].forEach(t=>e.add(t)),Array.from(e)}function mt(a,e,n){let t=new URLSearchParams;return t.set("pagetype","entitylist"),t.set("etn",e),t.set("viewid",`{${E(n)}}`),t.set("viewType","4230"),a.appId&&t.set("appid",a.appId),`${a.clientUrl}/main.aspx?${t.toString()}`}function gt(a){return Array.isArray(a.value)?a.value[0]||null:a}function ce(a){return Array.isArray(a)?a.length>0:Array.isArray(a?.value)?a.value.length>0:!1}function Ee(a){return Array.isArray(a)?a.length:Array.isArray(a?.value)?a.value.length:0}function ht(a){let e=a.OptionSet||a.optionSet,n=a.GlobalOptionSet||a.globalOptionSet;return Ee(e?.Options||e?.options)+Ee(n?.Options||n?.options)}function se(a){let e=a.OptionSet||a.optionSet,n=a.GlobalOptionSet||a.globalOptionSet;return ce(e?.Options||e?.options)||ce(n?.Options||n?.options)}function bt(a){return a.filter(e=>e.value!==void 0&&e.value!==null&&e.value!=="").map(e=>({Value:e.value,Label:{UserLocalizedLabel:{Label:e.text||String(e.value)}}}))}function ft(a){let e=new Set,n=[];return a.forEach(t=>{let i=t.attributevalue??t.AttributeValue;if(i==null||i==="")return;let o=String(i);e.has(o)||(e.add(o),n.push({Value:Number.isFinite(Number(o))?Number(o):o,Label:{UserLocalizedLabel:{Label:String(t.value??t.Value??o)}}}))}),n.sort((t,i)=>Number(t.Value)-Number(i.Value))}function yt(a){let e=a.userqueryid||a.id;if(e)return E(String(e));let n=a["@odata.id"],t=typeof n=="string"?n.match(/\(([^)]+)\)$/):null;return E(t?.[1]||"")}function wt(a){try{return JSON.parse(a).error?.message||a}catch{return a}}function ve(a){let e=String(a||"").toLowerCase();if(!e)return null;let n=[`[data-id='${F(e)}']`,`[data-id='${F(e)}.fieldControl-label']`,`[data-id='${F(e)}.fieldControl']`,`[data-id*='${F(e)}'][data-id*='label']`,`label[for='${F(e)}']`,`#${F(e)}_label`,`#${F(e)}_c`,`#${F(e)}`];for(let t of n)try{let i=document.querySelector(t);if(i)return i.closest("[data-id], section, td, div")||i}catch{}return null}function F(a){let e=window.CSS?.escape;return e?e(a):a.replace(/['"\\#.:,[\]()]/g,"\\$&")}var Ce=["Entities","Attributes","Relationships","RelationshipsNN","Global OptionSets","OptionSets","Booleans","Views","Charts","Forms","Forms Tabs","Forms Sections","Forms Fields","SiteMap Areas","SiteMap Groups","SiteMap SubAreas","Dashboards","Dashboards Tabs","Dashboards Sections","Dashboards Fields"],Te={entities:!0,attributes:!0,relationships:!0,globalOptionSets:!0,optionSets:!0,booleans:!0,views:!0,charts:!0,forms:!0,formTabs:!0,formSections:!0,formFields:!0,siteMap:!0,dashboards:!0,labelMode:"both",languageMode:"all",languageToExport:1036,translationRowFilter:"all"};var J={picklist:"Microsoft.Dynamics.CRM.PicklistAttributeMetadata",multiselectpicklist:"Microsoft.Dynamics.CRM.MultiSelectPicklistAttributeMetadata",state:"Microsoft.Dynamics.CRM.StateAttributeMetadata",status:"Microsoft.Dynamics.CRM.StatusAttributeMetadata",boolean:"Microsoft.Dynamics.CRM.BooleanAttributeMetadata"};async function He(a,e,n,t,i){let o=new Map,r=(c,m)=>(o.has(c)||o.set(c,{name:c,keyColumns:m,rows:[]}),o.get(c)),s=0,l=(c,m,g)=>{m.length!==0&&(c.rows.push(...m),s+=m.length,(s===m.length||m.length>=25||s%250<m.length)&&i(`${g}: ${s.toLocaleString()} rows extracted`))},u=new Map;e.length>0&&await D(e,4,async(c,m)=>{i(`Loading metadata ${m+1} of ${e.length}: ${c}`),u.set(c,await Xt(a,c,n))});let p=0;if(u.forEach((c,m)=>{C(i,"Extracting metadata labels",p++,u.size,1),t.entities&&l(r("Entities",["Entity Id","Entity Logical Name","Type"]),Mt(c,n,t),`Entity labels ${m}`),t.attributes&&l(r("Attributes",["Attribute Id","Entity Logical Name","Attribute Logical Name","Type"]),Et(c,n,t),`Attribute labels ${m}`),t.relationships&&(l(r("Relationships",["Relationship Id","Entity Logical Name","Schema Name","Type"]),Ne(c,"Relationships",n),`Relationship labels ${m}`),l(r("RelationshipsNN",["Relationship Id","Entity Logical Name","Schema Name","Intersect Entity","Type"]),Ne(c,"RelationshipsNN",n),`N:N relationship labels ${m}`)),(t.optionSets||t.booleans)&&j(c).forEach(g=>{let h=X(g.AttributeType);h==="boolean"&&t.booleans?l(r("Booleans",["Attribute Id","Entity Logical Name","Attribute Logical Name","Value","Type"]),Ct(m,g,n,t),`Boolean labels ${m}.${g.LogicalName||""}`):at(h)&&t.optionSets&&l(r("OptionSets",["Attribute Id","Entity Logical Name","Attribute Logical Name","Attribute Type","Value","Type"]),vt(m,g,n,t),`Option labels ${m}.${g.LogicalName||""}`)})}),t.globalOptionSets&&(i("Loading global option sets..."),l(r("Global OptionSets",["OptionSet Id","OptionSet Name","Value","Type"]),await Tt(a,n,t,i),"Global option set labels")),t.views&&(i("Loading view translations..."),l(r("Views",["View Id","Entity Logical Name","ViewType","Type"]),await Nt(a,e,n,t,i),"View labels")),t.charts&&(i("Loading chart translations..."),l(r("Charts",["Chart Id","Entity Logical Name","Type"]),await Ot(a,e,n,t,i),"Chart labels")),t.forms||t.formTabs||t.formSections||t.formFields){i("Loading form translations...");let c=e.filter(m=>u.get(m)?.IsBPFEntity!==!0);c.length>0&&(await Oe(a,c,n,t,!1,i,u)).forEach(g=>l(r(g.name,g.keyColumns),g.rows,`${g.name} labels`))}return t.dashboards&&(i("Loading dashboard translations..."),(await Oe(a,[],n,t,!0,i,u)).forEach(m=>l(r(m.name,m.keyColumns),m.rows,`${m.name} labels`))),t.siteMap&&(i("Loading sitemap translations..."),(await It(a,n,i)).forEach(m=>l(r(m.name,m.keyColumns),m.rows,`${m.name} labels`))),Ce.map(c=>o.get(c)).filter(c=>!!c).map(c=>({...c,rows:tn(c.rows,t)}))}function C(a,e,n,t,i){!a||t<=0||(n===0||n===t-1||(n+1)%i===0)&&a(`${e} ${n+1} of ${t}`)}var ke=10,kt=1,St=6,Ae=4,Rt=1e3,xt=500,Lt=250,W={Consistency:"Strong"};function Mt(a,e,n){let t=a.LogicalName||"",i=[];return n.labelMode!=="descriptions"&&(i.push(y("Entities",[a.MetadataId||"",t,"DisplayName"],"DisplayName",{kind:"entity",entityLogicalName:t,labelProperty:"DisplayName"},w(a.DisplayName,e))),i.push(y("Entities",[a.MetadataId||"",t,"DisplayCollectionName"],"DisplayCollectionName",{kind:"entity",entityLogicalName:t,labelProperty:"DisplayCollectionName"},w(a.DisplayCollectionName,e)))),n.labelMode!=="names"&&i.push(y("Entities",[a.MetadataId||"",t,"Description"],"Description",{kind:"entity",entityLogicalName:t,labelProperty:"Description"},w(a.Description,e))),i}function Et(a,e,n){let t=a.LogicalName||"";return nn(a).flatMap(i=>{let o=[],r=i.LogicalName||"";return n.labelMode!=="descriptions"&&o.push(y("Attributes",[i.MetadataId||"",t,r,"DisplayName"],"DisplayName",{kind:"attribute",entityLogicalName:t,attributeLogicalName:r,attributeType:i.AttributeType,labelProperty:"DisplayName"},w(i.DisplayName,e))),n.labelMode!=="names"&&o.push(y("Attributes",[i.MetadataId||"",t,r,"Description"],"Description",{kind:"attribute",entityLogicalName:t,attributeLogicalName:r,attributeType:i.AttributeType,labelProperty:"Description"},w(i.Description,e))),o})}function vt(a,e,n,t){let o=X(e.AttributeType)==="state"?"state":"option",r=e.LogicalName||"";return tt(e).flatMap(({option:l,optionSetName:u})=>{let p=[];return l.Value==null||(t.labelMode!=="descriptions"&&p.push(y("OptionSets",[e.MetadataId||"",a,r,e.AttributeType||"",String(l.Value),"Label"],"Label",{kind:"option",entityLogicalName:a,attributeLogicalName:r,attributeType:e.AttributeType,optionSetName:u,optionValue:l.Value,labelProperty:"Label",optionKind:o},w(l.Label,n))),t.labelMode!=="names"&&p.push(y("OptionSets",[e.MetadataId||"",a,r,e.AttributeType||"",String(l.Value),"Description"],"Description",{kind:"option",entityLogicalName:a,attributeLogicalName:r,attributeType:e.AttributeType,optionSetName:u,optionValue:l.Value,labelProperty:"Description",optionKind:o},w(l.Description,n)))),p})}function Ct(a,e,n,t){let i=e.LogicalName||"";return tt(e).flatMap(({option:r,optionSetName:s})=>{let l=[];return r.Value==null||(t.labelMode!=="descriptions"&&l.push(y("Booleans",[e.MetadataId||"",a,i,String(r.Value),"Label"],"Label",{kind:"option",entityLogicalName:a,attributeLogicalName:i,attributeType:e.AttributeType,optionSetName:s,optionValue:r.Value,labelProperty:"Label",optionKind:"boolean"},w(r.Label,n))),t.labelMode!=="names"&&l.push(y("Booleans",[e.MetadataId||"",a,i,String(r.Value),"Description"],"Description",{kind:"option",entityLogicalName:a,attributeLogicalName:i,attributeType:e.AttributeType,optionSetName:s,optionValue:r.Value,labelProperty:"Description",optionKind:"boolean"},w(r.Description,n)))),l})}function Ne(a,e,n){let t=a.LogicalName||"";return e==="RelationshipsNN"?$(a.ManyToManyRelationships).flatMap(i=>{let o=i.Entity1LogicalName===t?"Entity1AssociatedMenuConfiguration":"Entity2AssociatedMenuConfiguration",r=i[o];return Fe(r)?y("RelationshipsNN",[i.MetadataId||"",t,i.SchemaName||"",i.IntersectEntityName||"","AssociatedMenuLabel"],"AssociatedMenuLabel",{kind:"relationship",entityLogicalName:t,relationshipSet:"ManyToManyRelationships",schemaName:i.SchemaName||"",menuProperty:o},w(r?.Label,n)):[]}):$(a.ManyToOneRelationships).concat($(a.OneToManyRelationships)).flatMap(i=>{let o=i.AssociatedMenuConfiguration;return Fe(o)?y("Relationships",[i.MetadataId||"",t,i.SchemaName||"","AssociatedMenuLabel"],"AssociatedMenuLabel",{kind:"relationship",entityLogicalName:t,relationshipSet:rn(i,t)?"ManyToOneRelationships":"OneToManyRelationships",schemaName:i.SchemaName||"",menuProperty:"AssociatedMenuConfiguration"},w(o?.Label,n)):[]})}async function Tt(a,e,n,t){let i=await At(a,e,t),o=[];return i.forEach((r,s)=>{C(t,"Loading global option set translations",s,i.length,10),O(r).forEach(l=>{!r.Name||l.Value==null||(n.labelMode!=="descriptions"&&o.push(y("Global OptionSets",[r.MetadataId||"",r.Name,String(l.Value),"Label"],"Label",{kind:"globalOption",optionSetName:r.Name,optionValue:l.Value,labelProperty:"Label"},w(l.Label,e))),n.labelMode!=="names"&&o.push(y("Global OptionSets",[r.MetadataId||"",r.Name,String(l.Value),"Description"],"Description",{kind:"globalOption",optionSetName:r.Name,optionValue:l.Value,labelProperty:"Description"},w(l.Description,e))))})}),o}async function At(a,e,n){let i=(await T(a,"GlobalOptionSetDefinitions?$select=MetadataId,Name",r=>{n?.(`Loading global option set records ${r.toLocaleString()}`)})).filter(r=>!!r.Name);return(await D(i,4,async(r,s)=>(C(n,"Loading global option sets",s,i.length,10),Z(a,r,e)))).filter(r=>O(r).length>0)}async function Z(a,e,n,t){let i=e.Name||"",o=cn(i),r=x(e.MetadataId||""),s=B(n),l=[`GlobalOptionSetDefinitions(Name='${o}')/Microsoft.Dynamics.CRM.OptionSetMetadata${s}`,`GlobalOptionSetDefinitions(Name='${o}')/Microsoft.Dynamics.CRM.BooleanOptionSetMetadata${s}`,r?`GlobalOptionSetDefinitions(${r})/Microsoft.Dynamics.CRM.OptionSetMetadata${s}`:"",r?`GlobalOptionSetDefinitions(${r})/Microsoft.Dynamics.CRM.BooleanOptionSetMetadata${s}`:"",`GlobalOptionSetDefinitions(Name='${o}')${s}`].filter(Boolean);for(let u of l)try{let p=await a.webApiRequest(u,"GET",void 0,t);if(O(p).length>0)return{...e,...p}}catch{}if(n.length>1){let u={...e};for(let p of n){let c=await Z(a,e,[p],t);O(c).length>0&&(O(u).length===0?u={...e,...c}:we(u,c))}return u}return e}async function Nt(a,e,n,t,i){let r=(await D(e,4,async(l,u)=>(C(i,"Loading view entity records",u,e.length,1),(await T(a,`savedqueries?$select=savedqueryid,name,description,returnedtypecode,querytype&$filter=returnedtypecode eq '${S(l)}'`,c=>i?.(`Loading view records for ${l}: ${c.toLocaleString()}`)).catch(()=>[])).map(c=>({entityName:l,view:c}))))).flat();return(await D(r,ke,async({entityName:l,view:u},p)=>{let c=[];C(i,"Loading view translations",p,r.length,25);let m=x(u.savedqueryid||"");if(!m)return c;let[g,h]=await Promise.all([t.labelMode!=="descriptions"?V(a,"savedquery",m,"name",n,u.name||""):Promise.resolve(null),t.labelMode!=="names"?V(a,"savedquery",m,"description",n,u.description||""):Promise.resolve(null)]);return g&&c.push(y("Views",[m,l,String(u.querytype||""),"Name"],"Name",{kind:"locLabel",recordEntity:"savedquery",recordId:m,attributeName:"name"},g)),h&&c.push(y("Views",[m,l,String(u.querytype||""),"Description"],"Description",{kind:"locLabel",recordEntity:"savedquery",recordId:m,attributeName:"description"},h)),c})).flat()}async function Ot(a,e,n,t,i){let r=(await D(e,4,async(l,u)=>(C(i,"Loading chart entity records",u,e.length,1),(await T(a,`savedqueryvisualizations?$select=savedqueryvisualizationid,name,description,primaryentitytypecode&$filter=primaryentitytypecode eq '${S(l)}'`,c=>i?.(`Loading chart records for ${l}: ${c.toLocaleString()}`)).catch(()=>[])).map(c=>({entityName:l,chart:c}))))).flat();return(await D(r,ke,async({entityName:l,chart:u},p)=>{let c=[];C(i,"Loading chart translations",p,r.length,25);let m=x(u.savedqueryvisualizationid||"");if(!m)return c;let[g,h]=await Promise.all([t.labelMode!=="descriptions"?V(a,"savedqueryvisualization",m,"name",n,u.name||""):Promise.resolve(null),t.labelMode!=="names"?V(a,"savedqueryvisualization",m,"description",n,u.description||""):Promise.resolve(null)]);return g&&c.push(y("Charts",[m,l,"Name"],"Name",{kind:"locLabel",recordEntity:"savedqueryvisualization",recordId:m,attributeName:"name"},g)),h&&c.push(y("Charts",[m,l,"Description"],"Description",{kind:"locLabel",recordEntity:"savedqueryvisualization",recordId:m,attributeName:"description"},h)),c})).flat()}async function Oe(a,e,n,t,i,o,r){let s=i?"Dashboards":"Forms",l=new Map,u=(f,b)=>l.set(f,(l.get(f)||[]).concat(b)),p=i?"$filter=type eq 0":e.length?`$filter=${e.map(f=>`objecttypecode eq '${S(f)}'`).join(" or ")}`:"",c=`systemforms?$select=formid,formidunique,name,description,objecttypecode,type,formxml${p?`&${p}`:""}`,m=await T(a,c,f=>{o?.(`Loading ${s.toLowerCase()} records ${f.toLocaleString()}`)}).catch(()=>[]),h=i||t.formTabs||t.formSections||t.formFields?await Dt(a,c,m,n,t,i,o,r):[];(i||t.forms)&&(await D(m,ke,async(b,v)=>{let k=[];C(o,`Loading ${s.toLowerCase()} translations`,v,m.length,25);let R=x(b.formid||"");if(!R)return k;let Q=Xe(r,b.objecttypecode||"")?.LogicalName||b.objecttypecode||"",[Le,Me]=await Promise.all([t.labelMode!=="descriptions"?V(a,"systemform",R,"name",n,b.name||""):Promise.resolve(null),t.labelMode!=="names"?V(a,"systemform",R,"description",n,b.description||""):Promise.resolve(null)]);return Le&&k.push({sheet:s,row:y(s,[b.formidunique||R,R,Q,"Name"],"Name",{kind:"locLabel",recordEntity:"systemform",recordId:R,attributeName:"name"},Le)}),Me&&k.push({sheet:s,row:y(s,[b.formidunique||R,R,Q,"Description"],"Description",{kind:"locLabel",recordEntity:"systemform",recordId:R,attributeName:"description"},Me)}),k})).flat().forEach(({sheet:b,row:v})=>u(b,v)),h.forEach(f=>{(f.sheet.endsWith("Tabs")&&(i||t.formTabs)||f.sheet.endsWith("Sections")&&(i||t.formSections)||f.sheet.endsWith("Fields")&&(i||t.formFields))&&u(f.sheet,f)});let L={Forms:["Form Unique Id","Form Id","Entity Logical Name","Type"],"Forms Tabs":["Form Unique Id","Form Name","Tab Name","Type"],"Forms Sections":["Form Unique Id","Form Name","Tab Name","Section Name","Type"],"Forms Fields":["Form Unique Id","Form Name","Field Name","Type"],Dashboards:["Dashboard Unique Id","Dashboard Id","Type"],"Dashboards Tabs":["Dashboard Unique Id","Dashboard Name","Tab Name","Type"],"Dashboards Sections":["Dashboard Unique Id","Dashboard Name","Tab Name","Section Name","Type"],"Dashboards Fields":["Dashboard Unique Id","Dashboard Name","Field Name","Type"],Entities:[],Attributes:[],Relationships:[],RelationshipsNN:[],"Global OptionSets":[],OptionSets:[],Booleans:[],Views:[],Charts:[],"SiteMap Areas":[],"SiteMap Groups":[],"SiteMap SubAreas":[]};return Array.from(l.entries()).map(([f,b])=>({name:f,keyColumns:L[f],rows:b}))}async function Dt(a,e,n,t,i,o,r,s){let l=new Map,u=await Qe(a).catch(()=>null),p=o?"Loading dashboard XML translations":"Loading form XML translations";if(!u?.systemuserid)return n.forEach((b,v)=>{let k=x(b.formid||"");k&&(C(r,p,v,n.length,25),De(b.formxml||"",k,b.name||k,t,i,o,b.objecttypecode||"",s).forEach(R=>Pe(l,R,t)))}),Array.from(l.values());let c=!1,m=u.uilanguageid,g=t.map(Number).filter((b,v,k)=>!!b&&k.indexOf(b)===v),h=Math.max(1,n.length*Math.max(1,g.length)),L=0,f=(b,v)=>{b.forEach(k=>{let R=x(k.formid||"");L+=1,R&&(C(r,p,L-1,h,25),De(k.formxml||"",R,k.name||R,[v],i,o,k.objecttypecode||"",s).forEach(Q=>Pe(l,Q,t)))})};try{for(let b of g){let v=n;m!==b&&(await Gt(a,u,b),c=!0,m=b,await $e(a,b).catch(()=>{}),await K(xt),v=await T(a,e,k=>{r?.(`${p} records ${k.toLocaleString()}`)}).catch(()=>[])),f(v,b)}}finally{c&&(await Bt(a,u).catch(()=>{}),u.uilanguageid&&await $e(a,u.uilanguageid).catch(()=>{}),await K(Lt))}return Array.from(l.values())}function De(a,e,n,t,i,o,r="",s){if(!a)return[];let l=new DOMParser().parseFromString(a,"application/xml"),u=o?"Dashboards":"Forms",p=[],c=i.labelMode!=="descriptions",g=Xe(s,r)?.LogicalName||r;return Array.from(l.querySelectorAll("tab")).forEach(h=>{let L=h.getAttribute("id")||h.getAttribute("name")||"";c&&p.push(y(`${u} Tabs`,[e,n,L,"Label"],"Label",{kind:"formXml",formId:e,targetKind:"tab",targetId:L,entityLogicalName:g},pe(h,t))),Array.from(h.querySelectorAll("section")).forEach(f=>{let b=f.getAttribute("id")||f.getAttribute("name")||"";c&&p.push(y(`${u} Sections`,[e,n,L,b,"Label"],"Label",{kind:"formXml",formId:e,targetKind:"section",targetId:b,entityLogicalName:g},pe(f,t)))})}),Array.from(l.querySelectorAll("cell")).forEach(h=>{let L=h.querySelector("control"),f=L?.getAttribute("datafieldname")||L?.getAttribute("id")||h.getAttribute("id")||"";f&&c&&p.push(y(`${u} Fields`,[e,n,f,"Label"],"Label",{kind:"formXml",formId:e,targetKind:"field",targetId:f,entityLogicalName:g},pe(h,t)))}),p}function Xe(a,e){if(!a||a.size===0)return;let n=String(e||"").toLowerCase();if(n){let t=a.get(e)||Array.from(a.values()).find(o=>String(o.LogicalName||"").toLowerCase()===n);if(t)return t;let i=Array.from(a.values()).find(o=>String(o.ObjectTypeCode||"")===n);if(i)return i}return a.size===1?Array.from(a.values())[0]:void 0}async function It(a,e,n){let t=new Map,i=(r,s)=>t.set(r,(t.get(r)||[]).concat(s)),o=await T(a,"sitemaps?$select=sitemapid,sitemapname,sitemapxml",r=>{n?.(`Loading sitemap records ${r.toLocaleString()}`)}).catch(()=>[]);return o.forEach((r,s)=>{C(n,"Loading sitemap translations",s,o.length,1);let l=x(r.sitemapid||"");if(!l||!r.sitemapxml)return;let u=new DOMParser().parseFromString(r.sitemapxml,"application/xml");Array.from(u.querySelectorAll("Area")).forEach(p=>{let c=p.getAttribute("Id")||"";i("SiteMap Areas",y("SiteMap Areas",[r.sitemapname||l,l,c,"Title"],"Title",{kind:"sitemapXml",siteMapId:l,targetKind:"area",targetId:c},me(p,e))),Array.from(p.querySelectorAll(":scope > Group")).forEach(m=>{let g=m.getAttribute("Id")||"";i("SiteMap Groups",y("SiteMap Groups",[r.sitemapname||l,l,c,g,"Title"],"Title",{kind:"sitemapXml",siteMapId:l,targetKind:"group",targetId:g},me(m,e))),Array.from(m.querySelectorAll(":scope > SubArea")).forEach(h=>{let L=h.getAttribute("Id")||"";i("SiteMap SubAreas",y("SiteMap SubAreas",[r.sitemapname||l,l,c,g,L,"Title"],"Title",{kind:"sitemapXml",siteMapId:l,targetKind:"subarea",targetId:L},me(h,e)))})})})}),[{name:"SiteMap Areas",keyColumns:["SiteMap Name","SiteMap Id","Area Id","Type"],rows:t.get("SiteMap Areas")||[]},{name:"SiteMap Groups",keyColumns:["SiteMap Name","SiteMap Id","Area Id","Group Id","Type"],rows:t.get("SiteMap Groups")||[]},{name:"SiteMap SubAreas",keyColumns:["SiteMap Name","SiteMap Id","Area Id","Group Id","SubArea Id","Type"],rows:t.get("SiteMap SubAreas")||[]}]}async function Ge(a,e,n,t){let i=e.filter(H),o=0,r=async()=>{o+=1,t(o,i.length),await K(0)},s=i.filter(p=>p.source.kind==="formXml"),l=i.filter(p=>p.source.kind==="sitemapXml");await zt(a,s,n,r),await Vt(a,l,n,r);let u=i.filter(p=>p.source.kind!=="formXml"&&p.source.kind!=="sitemapXml");return await D(u,kt,async p=>{await r(),await Wt(a,p,n)}),{saved:e.length}}async function Be(a,e){let n=new Set,t=new Set,i=[],o=!1;if(e.filter(H).forEach(r=>{let s=r.source;if(s.kind==="entity"||s.kind==="attribute"||s.kind==="relationship"){s.entityLogicalName&&n.add(s.entityLogicalName);return}if(s.kind==="option"){s.optionSetName?t.add(s.optionSetName):s.entityLogicalName&&n.add(s.entityLogicalName);return}if(s.kind==="globalOption"){s.optionSetName&&t.add(s.optionSetName);return}if(s.kind==="formXml"){s.entityLogicalName?n.add(s.entityLogicalName):o=!0;return}if(s.kind==="locLabel"){if(s.recordEntity==="systemform"){i.push(r),r.keyValues[2]?n.add(r.keyValues[2]):o=!0;return}let l=s.recordEntity==="savedquery"||s.recordEntity==="savedqueryvisualization"?r.keyValues[1]:"";l?n.add(l):o=!0;return}o=!0}),!o&&(n.size>0||t.size>0)){let r="<importexportxml>"+(n.size?`<entities>${Array.from(n).map(s=>`<entity>${Ve(s)}</entity>`).join("")}</entities>`:"")+(t.size?`<optionsets>${Array.from(t).map(s=>`<optionset>${Ve(s)}</optionset>`).join("")}</optionsets>`:"")+"</importexportxml>";return await ue(a,"PublishXml",{ParameterXml:r}),i.length>0&&!await $t(a,i)?(await ue(a,"PublishAllXml",{}),"all"):"targeted"}return await ue(a,"PublishAllXml",{}),"all"}async function $t(a,e){for(let n of e){let t=n.source,i=Object.keys(n.labels).map(Number).filter(r=>A(n,r)),o=await V(a,t.recordEntity,t.recordId,t.attributeName,i,"",!1,!0);if(je(n,i,o))return!1}return!0}async function Ue(a,e,n,t){let i=0,o=e.filter(H);await D(o,St,async r=>{await Pt(a,r,n),i+=1,t(i,o.length)})}async function Pt(a,e,n){let t=null;for(let i=0;i<Ae;i+=1){let o=await qt(a,e,n);if(t=je(e,n,o),!t)return;i<Ae-1&&await K(Rt)}throw t}function je(a,e,n){if(!n)return null;for(let t of e.filter(i=>A(a,i)))if((n[t]||"")!==(a.labels[t]||""))return new Error(`${a.sheet} ${a.keyValues.join(" / ")} ${Y(t)} was not updated. Expected "${a.labels[t]||""}" but Dataverse returned "${n[t]||""}".`);return null}async function ue(a,e,n){await P(a,e,"POST",n)}async function P(a,e,n,t,i){let o=e==="PublishXml"||e==="PublishAllXml"?[3e3,6e3,1e4]:[1500,3e3];for(let r=0;;r+=1)try{return await a.webApiRequest(e,n,t,i)}catch(s){if(!Ft(s))throw s;if(r>=o.length)throw new Error("Dataverse is already running another publish, import, or solution operation. Your edits remain pending; wait for that operation to finish and run Save and Publish again.");await K(o[r])}}function Ft(a){let e=U(a).toLowerCase();return e.includes("cannot start")&&(e.includes("entitycustomization")||e.includes("import")||e.includes("solution installation"))}async function Wt(a,e,n){let t=e.source;if(n.filter(r=>A(e,r)).length===0)return;let o=en(e,n);if(t.kind==="entity"){let r=`EntityDefinitions(LogicalName='${S(t.entityLogicalName)}')`,s=await a.webApiRequest(r,"GET");await P(a,r,"PUT",qe({...s,[t.labelProperty]:o}),{"MSCRM.MergeLabels":"true"});return}if(t.kind==="attribute"){let r=`EntityDefinitions(LogicalName='${S(t.entityLogicalName)}')/Attributes(LogicalName='${S(t.attributeLogicalName)}')`,s=fe(t.attributeType),l;try{l=await a.webApiRequest(`${r}/${s}?$select=MetadataId`,"GET")}catch{l=await a.webApiRequest(`${r}?$select=MetadataId,AttributeType`,"GET").catch(()=>a.webApiRequest(r,"GET"));let p=typeof l["@odata.type"]=="string"?l["@odata.type"]:typeof l.AttributeType=="string"?l.AttributeType:"";p&&X(p)!=="attribute"&&(s=fe(p))}let u={"@odata.type":s,[t.labelProperty]:o};typeof l.MetadataId=="string"&&l.MetadataId&&(u.MetadataId=l.MetadataId),await P(a,`${r}/${s}`,"PUT",u,{"MSCRM.MergeLabels":"true"});return}if(t.kind==="option"){let r={Value:t.optionValue,[t.labelProperty]:o,MergeLabels:!0};t.optionSetName&&t.optionKind!=="state"?r.OptionSetName=t.optionSetName:(r.EntityLogicalName=t.entityLogicalName,r.AttributeLogicalName=t.attributeLogicalName),await P(a,t.optionKind==="state"?"UpdateStateValue":"UpdateOptionValue","POST",{...r});return}if(t.kind==="globalOption"){await P(a,"UpdateOptionValue","POST",{OptionSetName:t.optionSetName,Value:t.optionValue,[t.labelProperty]:o,MergeLabels:!0});return}if(t.kind==="locLabel"){await jt(a,t.recordEntity,t.recordId,t.attributeName,o);return}if(t.kind==="relationship"){let r=`EntityDefinitions(LogicalName='${S(t.entityLogicalName)}')/${t.relationshipSet}(SchemaName='${S(t.schemaName)}')`,s=await a.webApiRequest(r,"GET"),l=t.menuProperty,u=s[l]||{};await P(a,r,"PUT",qe({...s,[l]:{...u,Label:o}}),{"MSCRM.MergeLabels":"true"})}}async function qt(a,e,n){let t=e.source;if(t.kind==="entity"){let i=`EntityDefinitions(LogicalName='${S(t.entityLogicalName)}')${B(n)}`,o=await a.webApiRequest(i,"GET",void 0,W);return w(o[t.labelProperty],n)}if(t.kind==="attribute"){let i=`EntityDefinitions(LogicalName='${S(t.entityLogicalName)}')/Attributes(LogicalName='${S(t.attributeLogicalName)}')`,o=fe(t.attributeType),r=`${i}/${o}${B(n)}`,s=await a.webApiRequest(r,"GET",void 0,W).catch(()=>a.webApiRequest(`${i}${B(n)}`,"GET",void 0,W));return w(s[t.labelProperty],n)}if(t.kind==="option"){let i=t.optionSetName&&t.optionKind!=="state"?ge(O(await Z(a,{Name:t.optionSetName},n,W)),t.optionValue):ge(et(await Se(a,t.entityLogicalName,{LogicalName:t.attributeLogicalName,AttributeType:t.attributeType},n,W)),t.optionValue);return i?w(i[t.labelProperty],n):null}if(t.kind==="globalOption"){let i=await Z(a,{Name:t.optionSetName},n,W),o=ge(O(i),t.optionValue);return o?w(o[t.labelProperty],n):null}if(t.kind==="locLabel")return V(a,t.recordEntity,t.recordId,t.attributeName,n,"",t.recordEntity!=="systemform",!0);if(t.kind==="relationship"){let i=`EntityDefinitions(LogicalName='${S(t.entityLogicalName)}')/${t.relationshipSet}(SchemaName='${S(t.schemaName)}')${B(n)}`,r=(await a.webApiRequest(i,"GET",void 0,W))[t.menuProperty];return w(r?.Label,n)}return null}async function zt(a,e,n,t){let i=it(e.filter(H),o=>o.source.formId);for(let[o,r]of Object.entries(i)){await t();let s=`systemforms(${o})`,l=await a.webApiRequest(`${s}?$select=formxml`,"GET"),u=new DOMParser().parseFromString(l.formxml||"","application/xml");for(let p=0;p<r.length;p+=1){p>0&&await t();let c=r[p],m=c.source,g=Jt(u,m);if(!g)throw new Error(`${m.targetId} could not be found in form XML.`);Yt(u,g,c,n.filter(h=>A(c,h)))}await P(a,s,"PATCH",{formxml:new XMLSerializer().serializeToString(u)})}}async function Vt(a,e,n,t){let i=it(e.filter(H),o=>o.source.siteMapId);for(let[o,r]of Object.entries(i)){await t();let s=`sitemaps(${o})`,l=await a.webApiRequest(`${s}?$select=sitemapxml`,"GET"),u=new DOMParser().parseFromString(l.sitemapxml||"","application/xml");for(let p=0;p<r.length;p+=1){p>0&&await t();let c=r[p],m=c.source,g=Zt(u,m);if(!g)throw new Error(`${m.targetId} could not be found in sitemap XML.`);Qt(u,g,c,n.filter(h=>A(c,h)))}await P(a,s,"PATCH",{sitemapxml:new XMLSerializer().serializeToString(u)})}}async function te(a){return(await Ht(a)).filter(n=>!!n.LogicalName&&!!We(n.DisplayName)).filter(n=>n.IsBPFEntity!==!0).filter(n=>n.IsCustomizable?.Value!==!1||n.IsManaged===!1||n.IsManaged==null).map(n=>({id:x(n.MetadataId||n.LogicalName||""),logicalName:n.LogicalName||"",schemaName:n.SchemaName,objectTypeCode:n.ObjectTypeCode,displayName:We(n.DisplayName)||n.LogicalName||""})).sort((n,t)=>n.displayName.localeCompare(t.displayName)||n.logicalName.localeCompare(t.logicalName))}async function Ke(a){return(await T(a,"solutions?$select=solutionid,friendlyname,uniquename,ismanaged").catch(()=>[])).filter(n=>!!n.solutionid).sort((n,t)=>String(n.friendlyname||n.uniquename||"").localeCompare(String(t.friendlyname||t.uniquename||"")))}async function _e(a,e){let n=await te(a);if(!e)return n;let t=await T(a,`solutioncomponents?$select=objectid,componenttype&$filter=_solutionid_value eq ${x(e)} and componenttype eq 1`).catch(()=>[]),i=new Set(t.map(r=>x(r.objectid||"").toLowerCase()));if(i.size===0)return n;let o=n.filter(r=>i.has(r.id.toLowerCase()));return o.length?o:n}async function Ht(a){let e=[async()=>T(a,"EntityDefinitions?$select=MetadataId,LogicalName,SchemaName,ObjectTypeCode,DisplayName,IsCustomizable,IsManaged,IsBPFEntity"),async()=>(await a.webApiRequest("RetrieveAllEntities(EntityFilters=@p1,RetrieveAsIfPublished=@p2)?@p1=Microsoft.Dynamics.CRM.EntityFilters'Entity'&@p2=true","GET")).EntityMetadata||[],async()=>(await a.webApiRequest("RetrieveAllEntities(EntityFilters=Microsoft.Dynamics.CRM.EntityFilters'Entity',RetrieveAsIfPublished=true)","GET")).EntityMetadata||[],async()=>T(a,"EntityDefinitions")],n=null;for(let t of e)try{let i=await t();if(i.length>0)return i}catch(i){n=i}throw new Error(`Could not load entity metadata. ${U(n)}`)}async function Xt(a,e,n){let t=await be(a,e,n);if(ze(t,n))return Ie(a,e,t,n);let i={...t};for(let o of n)ze(i,[o])||ln(i,await be(a,e,[o]));return Ie(a,e,i,n)}async function be(a,e,n){let t=B(n,"&"),i=`EntityDefinitions(LogicalName='${S(e)}')?$select=MetadataId,LogicalName,SchemaName,ObjectTypeCode,DisplayName,DisplayCollectionName,Description,IsBPFEntity&$expand=Attributes($select=MetadataId,LogicalName,SchemaName,AttributeOf,DisplayName,Description,AttributeType),ManyToOneRelationships($select=MetadataId,SchemaName,ReferencingEntity,ReferencedEntity,ReferencingAttribute,ReferencedAttribute,AssociatedMenuConfiguration),OneToManyRelationships($select=MetadataId,SchemaName,ReferencingEntity,ReferencedEntity,ReferencingAttribute,ReferencedAttribute,AssociatedMenuConfiguration),ManyToManyRelationships($select=MetadataId,SchemaName,Entity1LogicalName,Entity2LogicalName,IntersectEntityName,Entity1IntersectAttribute,Entity2IntersectAttribute,Entity1AssociatedMenuConfiguration,Entity2AssociatedMenuConfiguration)`+t;try{return await a.webApiRequest(i,"GET")}catch(o){if(n.length>1)return be(a,e,[n[0]]);throw o}}async function Ie(a,e,n,t){let i=j(n),o=i.filter(l=>at(l.AttributeType)),r=await D(o,4,l=>Se(a,e,l,t)),s=new Map(r.map(l=>[l.LogicalName,l]));return n.Attributes=i.map(l=>{let u=s.get(l.LogicalName);return u?{...l,...u,AttributeType:l.AttributeType||u.AttributeType}:l}),n}async function Se(a,e,n,t,i){let o=J[X(n.AttributeType)];if(!o||!n.LogicalName)return n;let r=B(t,"&"),s=`EntityDefinitions(LogicalName='${S(e)}')/Attributes(LogicalName='${S(n.LogicalName)}')/${o}?$expand=OptionSet,GlobalOptionSet${r}`;try{return await a.webApiRequest(s,"GET",void 0,i)}catch{if(t.length<=1)return n;let l={...n};for(let u of t){let p=await Se(a,e,n,[u],i);ot(l,p)}return l}}async function Ye(a,e){let n=new Set([1033,1036]);e.languageId&&n.add(e.languageId);try{((await a.webApiRequest("RetrieveAvailableLanguages()","GET")).LocaleIds||[]).forEach(i=>n.add(i))}catch{try{((await a.webApiRequest("RetrieveProvisionedLanguages","POST",{})).LocaleIds||[]).forEach(i=>n.add(i))}catch{}}return Array.from(n).filter(Boolean).sort((t,i)=>{let o=[1033,1036];return(o.indexOf(t)===-1?50+t:o.indexOf(t))-(o.indexOf(i)===-1?50+i:o.indexOf(i))})}async function Qe(a){let e=await a.getContext(),n=x(e.userId||"");if(!n)return null;try{return await a.webApiRequest(`usersettingscollection(${n})?$select=systemuserid,uilanguageid,localeid,helplanguageid`,"GET")}catch{return(await T(a,`usersettingscollection?$select=systemuserid,uilanguageid,localeid,helplanguageid&$filter=systemuserid eq ${n}`).catch(()=>[]))[0]||null}}async function Gt(a,e,n){let t=x(e.systemuserid||"");t&&await Je(a,t,{localeid:n,uilanguageid:n,helplanguageid:n})}async function $e(a,e){let n=Date.now();for(;Date.now()-n<5e3;){let t=await Qe(a).catch(()=>null);if(!t||Number(t.uilanguageid)===e)return;await K(250)}}async function Bt(a,e){let n=x(e.systemuserid||"");if(!n)return;let t={};e.localeid!=null&&(t.localeid=e.localeid),e.uilanguageid!=null&&(t.uilanguageid=e.uilanguageid),e.helplanguageid!=null&&(t.helplanguageid=e.helplanguageid),Object.keys(t).length>0&&await Je(a,n,t)}async function Je(a,e,n){let t=x(e),i=Object.assign({"@odata.type":"Microsoft.Dynamics.CRM.usersettings",systemuserid:t},n);await a.webApiRequest("UpdateUserSettingsSystemUser","POST",{UserId:t,Settings:i}).catch(()=>a.webApiRequest(`usersettingscollection(${t})`,"PATCH",n))}async function T(a,e,n){let t=[],i=e;for(;i;){let o=await a.webApiRequest(i,"GET",void 0,{Prefer:"odata.include-annotations=*,odata.maxpagesize=5000"});t.push(...o.value||[]),n?.(t.length),i=Ut(o["@odata.nextLink"])}return t}function Ut(a){if(!a)return null;let e=a.match(/\/api\/data\/v[0-9.]+\/(.+)$/i);return e?e[1]:a}async function V(a,e,n,t,i,o,r=!0,s=!1){let l=await Kt(a).catch(()=>{});try{let p=`RetrieveLocLabels(EntityMoniker=@p1,AttributeName=@p2,IncludeUnpublished=@p3)?@p1=${encodeURIComponent(JSON.stringify(Ze(e,n)))}&@p2='${S(t)}'&@p3=${r?"true":"false"}`,c=await a.webApiRequest(p,"GET",void 0,s?W:void 0);return Array.isArray(c.Labels)?z(ee({LocalizedLabels:c.Labels}),i,o,l):z(ee(c.Label),i,o,l)}catch{return z({},i,o,l)}}async function jt(a,e,n,t,i){await P(a,"SetLocLabels","POST",{EntityMoniker:Ze(e,n),AttributeName:t,Labels:i.LocalizedLabels||[]})}async function Kt(a){let e=await a.getContext();return e.languageId?Number(e.languageId):void 0}function Ze(a,e){return{"@odata.type":`Microsoft.Dynamics.CRM.${a}`,[_t(a)]:x(e)}}function _t(a){return String(a||"").toLowerCase()==="systemform"?"formid":`${a}id`}function y(a,e,n,t,i){return{id:`${a}:${e.join(":")}:${JSON.stringify(t)}`,sheet:a,keyValues:e,type:n,source:t,labels:{...i},originalLabels:{...i}}}function Pe(a,e,n){let t=`${e.sheet}:${JSON.stringify(e.source)}`,i=a.get(t);if(!i){a.set(t,{...e,labels:z(e.labels,n,""),originalLabels:z(e.originalLabels,n,"")});return}n.forEach(o=>{e.labels[o]!=null&&(i.labels[o]=e.labels[o],i.originalLabels[o]=e.originalLabels[o]??e.labels[o])})}function w(a,e){return z(ee(a),e,"")}function ee(a){let e={};return(a?.LocalizedLabels||[]).forEach(n=>{n.LanguageCode&&(e[n.LanguageCode]=n.Label||"")}),a?.UserLocalizedLabel?.LanguageCode&&e[a.UserLocalizedLabel.LanguageCode]==null&&(e[a.UserLocalizedLabel.LanguageCode]=a.UserLocalizedLabel.Label||""),e}function z(a,e,n,t){let i={...a};return e.forEach((o,r)=>{i[o]==null&&(i[o]=n&&(t?o===t:r===0)?n:"")}),i}function pe(a,e){let n={};return Array.from(a.querySelectorAll(":scope > labels > label")).forEach(t=>{let i=Number(t.getAttribute("languagecode")||t.getAttribute("languageCode"));i&&(n[i]=t.getAttribute("description")||t.textContent||"")}),z(n,e,"")}function me(a,e){let n={};Array.from(a.querySelectorAll(":scope > Titles > Title")).forEach(i=>{let o=Number(i.getAttribute("LCID")||i.getAttribute("languagecode"));o&&(n[o]=i.getAttribute("Title")||i.getAttribute("Description")||i.textContent||"")});let t=a.getAttribute("Title");return t&&n[e[0]]==null&&(n[e[0]]=t),z(n,e,"")}function Yt(a,e,n,t){let i=Array.from(e.children).find(o=>o.tagName.toLowerCase()==="labels");i||(i=a.createElement("labels"),e.appendChild(i)),t.forEach(o=>{let r=Array.from(i.children).find(s=>s.getAttribute("languagecode")===String(o));r||(r=a.createElement("label"),r.setAttribute("languagecode",String(o)),i.appendChild(r)),r.setAttribute("description",n.labels[o]||"")})}function Qt(a,e,n,t){let i=Array.from(e.children).find(o=>o.tagName==="Titles");i||(i=a.createElement("Titles"),e.appendChild(i)),t.forEach(o=>{let r=Array.from(i.children).find(s=>s.getAttribute("LCID")===String(o));r||(r=a.createElement("Title"),r.setAttribute("LCID",String(o)),i.appendChild(r)),r.setAttribute("Title",n.labels[o]||"")})}function Jt(a,e){let n=e.targetId.toLowerCase();return e.targetKind==="tab"?Array.from(a.querySelectorAll("tab")).find(t=>String(t.getAttribute("id")||t.getAttribute("name")||"").toLowerCase()===n)||null:e.targetKind==="section"?Array.from(a.querySelectorAll("section")).find(t=>String(t.getAttribute("id")||t.getAttribute("name")||"").toLowerCase()===n)||null:Array.from(a.querySelectorAll("cell")).find(t=>{let i=t.querySelector("control");return String(i?.getAttribute("datafieldname")||i?.getAttribute("id")||t.getAttribute("id")||"").toLowerCase()===n})||null}function Zt(a,e){let n=e.targetKind==="area"?"Area":e.targetKind==="group"?"Group":"SubArea";return Array.from(a.querySelectorAll(n)).find(t=>String(t.getAttribute("Id")||"").toLowerCase()===e.targetId.toLowerCase())||null}function en(a,e){return{LocalizedLabels:e.filter((t,i,o)=>o.indexOf(t)===i).filter(t=>A(a,t)||!!a.labels[t]||!!a.originalLabels[t]).map(t=>({Label:a.labels[t]||"",LanguageCode:t}))}}function ne(a,e){let n=e.languageMode==="single"?[1033,e.languageToExport]:a;return e.translationRowFilter==="all"?Array.from(new Set(n)):Array.from(new Set([...n,1033,1036]))}function ae(a,e){return e.languageMode==="single"?[e.languageToExport]:a}function tn(a,e){return e.translationRowFilter==="all"?a:a.filter(n=>{let t=n.labels[1033]||"",i=n.labels[1036]||"";if(!t.trim())return!1;let o=i===t,r=!i.trim();return e.translationRowFilter==="matchesEnglish"?o:e.translationRowFilter==="matchesEnglishOrBlank"&&o||r})}function j(a){return Array.isArray(a.Attributes)?a.Attributes:a.Attributes?.value||[]}function nn(a){return j(a).filter(e=>!an(e))}function an(a){return!!String(a.AttributeOf||"").trim()}function $(a){return Array.isArray(a)?a:a?.value||[]}function et(a){return on(a).map(e=>e.option)}function tt(a){if(X(a.AttributeType)==="boolean"){let n=q(a.OptionSet);return nt(n.length?n:q({FalseOption:a.FalseOption,TrueOption:a.TrueOption}))}return q(a.OptionSet)}function on(a){if(X(a.AttributeType)==="boolean")return nt([...q(a.OptionSet),...q(a.GlobalOptionSet,!0),...q({FalseOption:a.FalseOption,TrueOption:a.TrueOption})]);let n=q(a.OptionSet);return n.length?n:q(a.GlobalOptionSet,!0)}function ge(a,e){return a.find(n=>n.Value===e)}function nt(a){let e=new Map;return a.forEach(n=>{e.has(n.option.Value)||e.set(n.option.Value,n)}),Array.from(e.values())}function q(a,e=!1){let n=(e||a?.IsGlobal===!0)&&a?.Name||void 0;return O(a).map(t=>({option:t,optionSetName:n}))}function O(a){if(!a)return[];if(a.Options?.length)return a.Options;let e=[];return a.FalseOption&&e.push({...a.FalseOption,Value:a.FalseOption.Value??0}),a.TrueOption&&e.push({...a.TrueOption,Value:a.TrueOption.Value??1}),e}function at(a){return["picklist","state","status","multiselectpicklist","boolean"].includes(X(a))}function Fe(a){let e=typeof a?.Behavior=="object"?a?.Behavior?.Value:a?.Behavior;if(e==null)return!!a?.Label;let n=String(e).toLowerCase();return n==="uselabel"||n.endsWith(".uselabel")||n==="1"}function rn(a,e){return String(a.ReferencingEntity||"").toLowerCase()===e.toLowerCase()}function H(a){return Object.keys(a.labels).some(e=>A(a,Number(e)))}function A(a,e){return(a.labels[e]||"")!==(a.originalLabels[e]||"")}function We(a){return a?.UserLocalizedLabel?.Label||a?.LocalizedLabels?.[0]?.Label||""}function Y(a){return a===1033?"English Label":a===1036?"French Label":`${a} Label`}function fe(a){let e=X(a);return J[e]?J[e]:e==="lookup"||e==="customer"||e==="owner"?"Microsoft.Dynamics.CRM.LookupAttributeMetadata":e==="datetime"?"Microsoft.Dynamics.CRM.DateTimeAttributeMetadata":e==="integer"?"Microsoft.Dynamics.CRM.IntegerAttributeMetadata":e==="decimal"?"Microsoft.Dynamics.CRM.DecimalAttributeMetadata":e==="money"?"Microsoft.Dynamics.CRM.MoneyAttributeMetadata":"Microsoft.Dynamics.CRM.StringAttributeMetadata"}function X(a){let e=String(a||"").trim().toLowerCase();return(e.match(/'([^']+)'/)?.[1]||e).replace(/^#?microsoft\.dynamics\.crm\./,"").replace(/attributemetadata$/,"")}function qe(a){let e=ye(a);return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function ye(a){if(Array.isArray(a))return a.map(ye);if(!a||typeof a!="object")return a;let e={};return Object.entries(a).forEach(([n,t])=>{n.startsWith("@odata.")&&n!=="@odata.type"||(e[n]=ye(t))}),e}function it(a,e){return a.reduce((n,t)=>{let i=e(t);return n[i]=n[i]||[],n[i].push(t),n},{})}function B(a,e="?"){let n=Array.from(new Set(a.filter(Boolean)));return n.length>0?`${e}LabelLanguages=${n.join(",")}`:""}function ze(a,e){let n=[a.DisplayName,a.DisplayCollectionName,a.Description];return j(a).forEach(t=>{n.push(t.DisplayName,t.Description),et(t).forEach(i=>n.push(i.Label,i.Description))}),n.some(t=>sn(t,e))}function sn(a,e){let n=ee(a);return e.every(t=>n[t]!=null)}function ln(a,e){M(a.DisplayName,e.DisplayName),M(a.DisplayCollectionName,e.DisplayCollectionName),M(a.Description,e.Description);let n=new Map(j(a).map(t=>[t.LogicalName||t.MetadataId||"",t]));j(e).forEach(t=>{let i=n.get(t.LogicalName||t.MetadataId||"");i&&ot(i,t)}),he($(a.ManyToOneRelationships),$(e.ManyToOneRelationships)),he($(a.OneToManyRelationships),$(e.OneToManyRelationships)),he($(a.ManyToManyRelationships),$(e.ManyToManyRelationships))}function ot(a,e){M(a.DisplayName,e.DisplayName),M(a.Description,e.Description),!a.OptionSet&&e.OptionSet?a.OptionSet=e.OptionSet:we(a.OptionSet,e.OptionSet),!a.GlobalOptionSet&&e.GlobalOptionSet?a.GlobalOptionSet=e.GlobalOptionSet:we(a.GlobalOptionSet,e.GlobalOptionSet),!a.TrueOption&&e.TrueOption?a.TrueOption=e.TrueOption:a.TrueOption&&e.TrueOption&&(M(a.TrueOption.Label,e.TrueOption.Label),M(a.TrueOption.Description,e.TrueOption.Description)),!a.FalseOption&&e.FalseOption?a.FalseOption=e.FalseOption:a.FalseOption&&e.FalseOption&&(M(a.FalseOption.Label,e.FalseOption.Label),M(a.FalseOption.Description,e.FalseOption.Description))}function he(a,e){let n=new Map(a.map(t=>[t.SchemaName||t.MetadataId||"",t]));e.forEach(t=>{let i=n.get(t.SchemaName||t.MetadataId||"");i&&(M(i.AssociatedMenuConfiguration?.Label,t.AssociatedMenuConfiguration?.Label),M(i.Entity1AssociatedMenuConfiguration?.Label,t.Entity1AssociatedMenuConfiguration?.Label),M(i.Entity2AssociatedMenuConfiguration?.Label,t.Entity2AssociatedMenuConfiguration?.Label))})}function we(a,e){if(!a||!e)return;let n=new Map(O(a).map(t=>[t.Value,t]));O(e).forEach(t=>{let i=n.get(t.Value);i&&(M(i.Label,t.Label),M(i.Description,t.Description))})}function M(a,e){if(!a||!e)return;let n=new Map;(a.LocalizedLabels||[]).forEach(t=>{t.LanguageCode&&n.set(t.LanguageCode,{...t})}),(e.LocalizedLabels||[]).forEach(t=>{t.LanguageCode&&n.set(t.LanguageCode,{...t})}),e.UserLocalizedLabel?.LanguageCode&&n.set(e.UserLocalizedLabel.LanguageCode,{...e.UserLocalizedLabel}),a.LocalizedLabels=Array.from(n.values()).sort((t,i)=>(t.LanguageCode||0)-(i.LanguageCode||0))}function K(a){return new Promise(e=>globalThis.setTimeout(e,a))}async function D(a,e,n){let t=[],i=0,o=Array.from({length:Math.min(e,a.length)},async()=>{for(;i<a.length;){let r=i++;t[r]=await n(a[r],r)}});return await Promise.all(o),t}function S(a){return String(a||"").replace(/'/g,"''").toLowerCase()}function cn(a){return String(a||"").replace(/'/g,"''")}function Ve(a){return String(a||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function x(a){return String(a||"").replace(/[{}]/g,"")}function U(a){return a instanceof Error?a.message:String(a)}function Re(a){return a<1e3?`${Math.round(a)} ms`:`${(a/1e3).toFixed(1)} seconds`}var dn=[{key:"globalOptionSets",label:"Export Global OptionSets Labels Translation"},{key:"siteMap",label:"Export SiteMap custom labels Translation"},{key:"dashboards",label:"Export Dashboards custom labels Translation"}],un=[{key:"entities",label:"Export Entity Translation"},{key:"attributes",label:"Export Attributes Translation"},{key:"optionSets",label:"Export Picklists Option Labels Translation"},{key:"booleans",label:"Export Booleans Option Labels Translation"},{key:"views",label:"Export Views Translation"},{key:"charts",label:"Export Charts Translation"},{key:"forms",label:"Export Forms Translation"},{key:"formTabs",label:"Export Forms Tabs Translation"},{key:"formSections",label:"Export Forms Sections Translation"},{key:"formFields",label:"Export Forms Fields Translation"},{key:"relationships",label:"Export Relationships that are using custom labels"}],pn=36,_=52,ie=8,xe=class{constructor(){this.root=null;this.client=null;this.context=null;this.initialized=!1;this.openState=!1;this.runState="idle";this.message="Load entities, choose export options, then extract translations.";this.messageLevel="info";this.entities=[];this.solutions=[];this.solutionId="";this.entityLoadSource="all";this.selectedEntities={};this.entityFilter="";this.languages=[1033,1036];this.options={...Te};this.sheets=[];this.showSetup=!0;this.activeSheet="Entities";this.rowFilter="";this.changedCursor=-1;this.focusedCellKey="";this.entityDisplayColumnWidth=185;this.workbookColumnWidths={};this.workbookScrollTops={};this.workbookScrollLefts={};this.workbookGridHeights={};this.workbookRenderedStarts={};this.workbookTabsScrollLeft=0;this.workbookScrollFrame=0;this.frame=null;this.dragState=null;this.resizeState=null;this.entityColumnResizeState=null;this.workbookColumnResizeState=null;this.pointerHandlersInstalled=!1;this.handlePointerMove=e=>{if(this.entityColumnResizeState){let n=this.entityColumnResizeState;this.entityDisplayColumnWidth=Math.max(n.min,Math.min(n.max,n.width+e.clientX-n.startX)),this.updateEntityColumnWidth();return}if(this.workbookColumnResizeState){let n=this.workbookColumnResizeState;this.workbookColumnWidths={...this.workbookColumnWidths,[n.columnKey]:Math.max(n.min,Math.min(n.max,n.width+e.clientX-n.startX))},this.updateWorkbookColumnWidth(n.columnKey);return}if(this.dragState){this.setFrame({...this.getCurrentFrame(),left:Math.max(0,this.dragState.left+e.clientX-this.dragState.startX),top:Math.max(0,this.dragState.top+e.clientY-this.dragState.startY)});return}this.resizeState&&this.setFrame(mn(this.resizeState,e.clientX,e.clientY,720,560))};this.handlePointerUp=()=>{this.dragState=null,this.resizeState=null,this.entityColumnResizeState=null,this.workbookColumnResizeState=null}}open(){bn(),fn(),this.installPointerHandlers(),this.root||(this.root=document.createElement("div"),this.root.id="easytranslator-bookmarklet-root",this.root.className="easytranslator-shell",document.body.appendChild(this.root)),this.openState=!0,this.client=de(),this.render(),this.initialized||(this.initialized=!0,this.initialize())}close(){this.root?.remove(),this.root=null,this.openState=!1,this.dragState=null,this.resizeState=null,this.workbookScrollFrame&&(window.cancelAnimationFrame(this.workbookScrollFrame),this.workbookScrollFrame=0)}isOpen(){return this.openState}async initialize(){let e=this.requireClient();this.runState="loading",this.setMessage("Connecting to Dynamics and loading Easy Translator data...","info"),this.render();try{let n=await e.getContext();this.context=n;let t=te(e),i=Promise.all([Ye(e,n),Ke(e)]);i.catch(()=>{});let o=await t;this.entities=o,this.selectedEntities={},this.setMessage(`Loaded ${o.length.toLocaleString()} entities. Finishing startup...`,"info"),this.render();let[r,s]=await i;this.languages=r,this.options={...this.options,languageToExport:r.includes(1036)?1036:r.find(l=>l!==1033)||r[0]||1033},this.solutions=s,this.runState="idle",this.setMessage("Load entities, choose export options, then extract translations.","info"),this.render()}catch(n){this.runState="error",this.setMessage(U(n),"error"),this.render()}}async reloadEntitiesForSolution(){let e=this.requireClient();if(this.showSetup=!0,this.entityLoadSource==="solution"&&!this.solutionId){this.runState="error",this.setMessage("Select a solution, then click Load Entities.","error"),this.render();return}this.runState="loading",this.setMessage("Loading entities...","info"),this.render();try{let n=this.entityLoadSource==="solution"&&this.solutionId?await _e(e,this.solutionId):await te(e);this.entities=n,this.selectedEntities={},this.runState="idle",this.setMessage(`Loaded ${n.length.toLocaleString()} entities.`,"success"),this.render()}catch(n){this.runState="error",this.setMessage(U(n),"error"),this.render()}}async extractTranslations(){let e=this.requireClient(),n=Object.entries(this.selectedEntities).filter(([,i])=>i).map(([i])=>i);if(n.length===0&&this.entityRelatedOptionsEnabled()){this.runState="error",this.setMessage(this.entities.length===0?"Click Load Entities, then select at least one entity before extracting entity-related translations.":"Select at least one entity before extracting entity-related translations.","error"),this.render();return}this.runState="loading",this.setMessage("Extracting translations...","info"),this.render();let t=performance.now();try{let i=await He(e,n,ne(this.languages,this.options),this.options,r=>this.setMessage(r,"info"));this.sheets=i;let o=i.find(r=>r.rows.length>0);this.activeSheet=o?.name||"Entities",this.showSetup=!1,this.rowFilter="",this.changedCursor=-1,this.focusedCellKey="",this.runState="ready",this.setMessage(`Extracted ${i.reduce((r,s)=>r+s.rows.length,0).toLocaleString()} rows in ${Re(performance.now()-t)}.`,"success"),this.render()}catch(i){this.runState="error",this.setMessage(U(i),"error"),this.render()}}async saveTranslations(){let e=this.requireClient(),n=this.getChangedRows(),t=this.getChangedLocations().length;if(n.length===0){this.setMessage("No pending translation changes to save.","info");return}this.runState="saving",this.setMessage(`Saving ${t.toLocaleString()} pending changes across ${n.length.toLocaleString()} rows...`,"info"),this.render();let i=performance.now();try{let o=await Ge(e,n,ne(this.languages,this.options),(s,l)=>this.setMessage(`Saving row ${s.toLocaleString()} of ${l.toLocaleString()}...`,"info")),r=await Be(e,n);await Ue(e,n,ne(this.languages,this.options),(s,l)=>this.setMessage(`Verifying rows ${s.toLocaleString()} of ${l.toLocaleString()}...`,"info")),this.sheets=this.sheets.map(s=>({...s,rows:s.rows.map(l=>H(l)?{...l,originalLabels:{...l.labels}}:l)})),this.changedCursor=-1,this.focusedCellKey="",this.runState="ready",this.setMessage(`Saved ${o.saved.toLocaleString()} rows and ${r==="targeted"?"published targeted customizations":"published all customizations"} in ${Re(performance.now()-i)}.`,"success"),this.render()}catch(o){this.runState="error",this.setMessage(U(o),"error"),this.render()}}render(e){if(!this.root)return;let n=this.root.querySelector(".easytranslator-entities")?.scrollTop||0,t=d("section",{className:"easytranslator-panel"},this.renderHeader(),d("div",{className:`easytranslator-body${this.hasWorkbook()&&!this.showSetup?" workbook-mode":""}`},this.renderMessage(),this.showSetup?this.renderSetup():null,this.hasWorkbook()&&!this.showSetup?this.renderWorkbook():null),...this.renderResizeHandles());this.root.replaceChildren(t),this.applyPanelFrame();let i=this.root.querySelector(".easytranslator-entities");i&&(i.scrollTop=n),this.restoreWorkbookScroll(),this.restoreWorkbookTabsScroll(),this.restoreFocus(e)}renderHeader(){return d("header",{className:"easytranslator-header",on:{pointerdown:e=>this.startDrag(e)}},d("div",{className:"easytranslator-page-title"},d("h1",{text:"Easy Translator"}),d("p",{text:this.context?.clientUrl?`Connected to ${this.context.clientUrl}`:"Connected to Dynamics",title:this.context?.clientUrl||"Connected to Dynamics"})),d("div",{className:"easytranslator-actions"},this.toolButton("Extract translations","load",()=>void this.extractTranslations(),this.runState==="loading"||this.runState==="saving"),this.toolButton("Save and Publish","save",()=>void this.saveTranslations(),this.getChangedRows().length===0||this.runState==="loading"||this.runState==="saving","save",!0),this.button("Close","primary",()=>this.close())))}renderResizeHandles(){return["n","e","s","w","ne","nw","se","sw"].map(e=>d("span",{className:`easytranslator-resize ${e}`,dataset:{resizeEdge:e},on:{pointerdown:n=>this.startResize(n,e)}}))}installPointerHandlers(){this.pointerHandlersInstalled||(window.addEventListener("pointermove",this.handlePointerMove),window.addEventListener("pointerup",this.handlePointerUp),window.addEventListener("pointercancel",this.handlePointerUp),this.pointerHandlersInstalled=!0)}startDrag(e){if(e.target.closest("button, input, select, textarea, a"))return;let n=this.getCurrentFrame();this.frame=n,this.dragState={startX:e.clientX,startY:e.clientY,left:n.left,top:n.top},e.preventDefault()}startResize(e,n){let t=this.getCurrentFrame();this.frame=t,this.resizeState={startX:e.clientX,startY:e.clientY,edge:n,...t},e.preventDefault(),e.stopPropagation()}getCurrentFrame(){let n=this.root?.querySelector(".easytranslator-panel")?.getBoundingClientRect();return{left:n?.left||24,top:n?.top||24,width:n?.width||Math.min(1320,window.innerWidth-24),height:n?.height||Math.min(760,window.innerHeight-48)}}setFrame(e){this.frame=e,this.applyPanelFrame()}applyPanelFrame(){if(!this.frame)return;let e=this.root?.querySelector(".easytranslator-panel");e&&(e.style.left=`${this.frame.left}px`,e.style.top=`${this.frame.top}px`,e.style.width=`${this.frame.width}px`,e.style.height=`${this.frame.height}px`,e.style.transform="none")}renderMessage(){return d("div",{className:`easytranslator-message ${this.messageLevel}`,dataset:{message:"true"}},d("span",{text:this.message,dataset:{messageText:"true"}}),this.hasWorkbook()?this.button(this.showSetup?"View spreadsheet":"Export options","",()=>{this.showSetup=!this.showSetup,this.render()}):null)}renderSetup(){return d("div",{className:"easytranslator-config"},this.renderEntityPicker(),this.renderOptions())}renderEntityPicker(){let e=this.getVisibleEntities(),n=Object.values(this.selectedEntities).filter(Boolean).length,t=this.solutions.find(s=>s.solutionid===this.solutionId)?.friendlyname||"",i=d("select",{value:this.entityLoadSource,dataset:{focusKey:"entity-load-source"},on:{change:s=>{this.entityLoadSource=s.currentTarget.value==="solution"?"solution":"all",this.render(this.captureFocus(s.currentTarget))}}},d("option",{value:"all",text:"All entities"}),d("option",{value:"solution",text:"From a solution",disabled:this.solutions.length===0})),o=d("select",{value:this.solutionId,title:t,dataset:{focusKey:"solution"},on:{change:s=>{this.solutionId=s.currentTarget.value,this.render(this.captureFocus(s.currentTarget))}}},d("option",{value:"",text:"Select a solution"}),...this.solutions.map(s=>d("option",{value:s.solutionid,text:s.friendlyname||s.uniquename||s.solutionid,title:s.friendlyname||s.uniquename||s.solutionid}))),r=d("tbody",{},...e.map(s=>d("tr",{},d("td",{},d("label",{className:"easytranslator-entity-label"},this.entityCheckbox(s),d("span",{text:s.displayName}))),d("td",{text:s.logicalName}))));return d("section",{className:"easytranslator-card entity-picker"},d("div",{className:"easytranslator-card-head"},d("h2",{text:"Entities options"}),d("div",{className:"easytranslator-row-actions"},this.button("Load Entities","primary",()=>void this.reloadEntitiesForSolution(),this.runState==="loading"||this.runState==="saving"),this.button("Check all","",()=>{this.selectedEntities=Object.fromEntries(this.entities.map(s=>[s.logicalName,!0])),this.render()}),this.button("Clear all","",()=>{this.selectedEntities={},this.render()}))),d("label",{className:"easytranslator-field"},d("span",{text:"Load source"}),i),this.entityLoadSource==="solution"?d("label",{className:"easytranslator-field"},d("span",{text:"Solution"}),o):null,d("input",{className:"easytranslator-filter",type:"search",value:this.entityFilter,attrs:{placeholder:"Filter entities"},dataset:{focusKey:"entity-filter"},on:{input:s=>{this.entityFilter=s.currentTarget.value,this.render(this.captureFocus(s.currentTarget))}}}),d("div",{className:"easytranslator-entities"},d("div",{className:"easytranslator-table-column-resize",style:{left:`${this.entityDisplayColumnWidth}px`},on:{pointerdown:s=>this.startEntityColumnResize(s)}}),d("table",{},d("colgroup",{},d("col",{className:"easytranslator-entity-display-col",style:{width:`${this.entityDisplayColumnWidth}px`}}),d("col",{className:"easytranslator-entity-schema-col"})),d("thead",{},d("tr",{},d("th",{text:"Display name"}),d("th",{text:"Schema name"}))),r)),d("div",{className:"easytranslator-mini",text:`${n.toLocaleString()} selected`}))}renderOptions(){return d("section",{className:"easytranslator-card options-grid"},d("div",{className:"easytranslator-option-box"},d("div",{className:"easytranslator-option-box-head"},d("h2",{text:"Global Options"}),this.linkButton("Clear all",()=>{this.options={...this.options,globalOptionSets:!1,siteMap:!1,dashboards:!1},this.render()})),...dn.map(e=>this.optionCheckbox(e.key,e.label))),d("div",{className:"easytranslator-option-box"},d("h2",{text:"Languages"}),this.radio(this.options.languageMode==="all","Export all",()=>{this.options={...this.options,languageMode:"all"},this.render()}),d("label",{className:"easytranslator-check"},d("input",{type:"radio",checked:this.options.languageMode==="single",on:{change:()=>{this.options={...this.options,languageMode:"single"},this.render()}}}),d("span",{text:"Export only"}),d("select",{value:String(this.options.languageToExport),disabled:this.options.languageMode!=="single",dataset:{focusKey:"language-to-export"},on:{change:e=>{this.options={...this.options,languageToExport:Number(e.currentTarget.value)},this.render(this.captureFocus(e.currentTarget))}}},...this.languages.map(e=>d("option",{value:String(e),text:Y(e)})))),d("label",{className:"easytranslator-translation-row-filter"},d("span",{text:"Rows"}),d("select",{value:this.options.translationRowFilter,dataset:{focusKey:"translation-row-filter"},on:{change:e=>{this.options={...this.options,translationRowFilter:e.currentTarget.value},this.render(this.captureFocus(e.currentTarget))}}},d("option",{value:"all",text:"All rows"}),d("option",{value:"matchesEnglish",text:"French matches English"}),d("option",{value:"matchesEnglishOrBlank",text:"French matches English or is blank"}),d("option",{value:"blank",text:"French is blank"})))),d("div",{className:"easytranslator-option-box wide"},d("div",{className:"easytranslator-option-box-head wide"},d("h2",{text:"Entity related options"}),this.linkButton("Clear all",()=>{this.options={...this.options,entities:!1,attributes:!1,optionSets:!1,booleans:!1,views:!1,charts:!1,forms:!1,formTabs:!1,formSections:!1,formFields:!1,relationships:!1},this.render()})),...un.map(e=>this.optionCheckbox(e.key,e.label))),d("div",{className:"easytranslator-option-box label-options"},d("h2",{text:"Label options"}),d("span",{text:"Export Name and Description"}),this.radio(this.options.labelMode==="both","Both",()=>{this.options={...this.options,labelMode:"both"},this.render()}),this.radio(this.options.labelMode==="names","Only Names",()=>{this.options={...this.options,labelMode:"names"},this.render()}),this.radio(this.options.labelMode==="descriptions","Only Descriptions",()=>{this.options={...this.options,labelMode:"descriptions"},this.render()})))}renderWorkbook(){let e=this.getActiveSheet(),n=this.getActiveRows(e);return d("div",{className:"easytranslator-workbook"},d("div",{className:"easytranslator-workbook-top"},d("input",{type:"search",value:this.rowFilter,attrs:{placeholder:"Filter rows"},dataset:{focusKey:"row-filter"},on:{input:t=>{this.rowFilter=t.currentTarget.value;let i=this.getActiveSheet();i&&(this.workbookScrollTops[i.name]=0),this.render(this.captureFocus(t.currentTarget))}}}),d("div",{className:"easytranslator-changed-nav"},this.button("\u2191","",()=>this.goToPendingChange(-1),this.getChangedLocations().length===0),this.button(`${this.getChangedLocations().length.toLocaleString()} pending changes`,"",()=>this.goToPendingChange(1),this.getChangedLocations().length===0,"pending"),this.button("\u2193","",()=>this.goToPendingChange(1),this.getChangedLocations().length===0))),d("div",{className:"easytranslator-grid",dataset:e?{sheetName:e.name}:void 0,on:{scroll:t=>this.handleWorkbookScroll(t)}},e?this.renderWorkbookTable(e,n):d("div",{className:"easytranslator-empty",text:"Extract translations to populate the Easy Translator workbook tabs."})),d("div",{className:"easytranslator-tabs",on:{scroll:t=>this.handleWorkbookTabsScroll(t)}},...this.getVisibleSheets().map(t=>this.button(`${t.name} (${t.rows.length})`,this.getActiveSheet()?.name===t.name?"active":"",()=>{this.captureWorkbookTabsScroll(),this.activeSheet=t.name,this.render()}))))}renderWorkbookTable(e,n){let t=ae(this.languages,this.options),i=this.getWorkbookColumns(e,t);return d("table",{className:"easytranslator-grid-table"},d("colgroup",{},...i.map(o=>d("col",{dataset:{columnKey:this.workbookColumnKey(e,o.colId)},style:{width:`${this.getWorkbookColumnWidth(e,o)}px`}}))),d("thead",{},d("tr",{},...i.map(o=>this.renderWorkbookHeaderCell(e,o)))),d("tbody",{},...this.renderWorkbookRowElements(e,n,i,this.workbookScrollTops[e.name]||0,this.workbookGridHeights[e.name]||520)))}renderWorkbookRowElements(e,n,t,i,o){let r=this.getWorkbookVisibleCapacity(o),s=this.getWorkbookVisibleStart(i,n.length,r),l=Math.min(n.length,s+r+ie*2),u=n.slice(s,l),p=s*_,c=Math.max(0,(n.length-l)*_);return this.workbookRenderedStarts[e.name]=s,[p>0?this.renderWorkbookSpacerRow(t.length,p):null,...u.map((m,g)=>d("tr",{},...t.map(h=>h.kind==="rowNumber"?d("td",{className:"row-number",text:String(s+g+1)}):h.kind==="key"?d("td",{className:"key-cell",text:m.keyValues[h.keyIndex||0]||""}):this.renderLabelCell(m,h.language||1033)))),c>0?this.renderWorkbookSpacerRow(t.length,c):null].filter(m=>!!m)}renderWorkbookSpacerRow(e,n){return d("tr",{className:"easytranslator-virtual-spacer"},d("td",{attrs:{colspan:String(e)},style:{height:`${n}px`}}))}getWorkbookColumns(e,n){return[{colId:"row-number",header:"#",width:46,minWidth:46,maxWidth:74,resizable:!1,kind:"rowNumber"},...e.keyColumns.map((t,i)=>({colId:`key-${i}`,header:t,width:i===0?205:170,minWidth:120,resizable:!0,kind:"key",keyIndex:i})),...n.map(t=>({colId:`label-${t}`,header:Y(t),width:260,minWidth:190,resizable:!0,kind:"label",language:t}))]}renderWorkbookHeaderCell(e,n){return d("th",{className:n.kind==="rowNumber"?"row-number-header":""},d("span",{className:"easytranslator-header-label",text:n.header}),n.resizable?d("span",{className:"easytranslator-column-resize",on:{pointerdown:t=>this.startWorkbookColumnResize(t,e,n)}}):null)}renderLabelCell(e,n){let t=`label-${n}`,i=`${rt(e)}:${t}`,o=d("textarea",{value:e.labels[n]||"",attrs:{wrap:"off",spellcheck:"false"},dataset:{cellKey:i},on:{input:r=>{let s=r.currentTarget;e.labels={...e.labels,[n]:s.value},s.closest("td")?.classList.toggle("changed",A(e,n)),this.updatePendingWidgets()}}});return d("td",{className:[A(e,n)?"changed":"",this.focusedCellKey===i?"focused-change":""].filter(Boolean).join(" ")},o)}startEntityColumnResize(e){e.preventDefault(),e.stopPropagation();let n=this.root?.querySelector(".easytranslator-entities")?.getBoundingClientRect();this.entityColumnResizeState={startX:e.clientX,width:this.entityDisplayColumnWidth,min:130,max:Math.max(130,(n?.width||390)-130)}}updateEntityColumnWidth(){let e=`${this.entityDisplayColumnWidth}px`,n=this.root;n?.querySelectorAll(".easytranslator-entity-display-col").forEach(t=>{t.style.width=e}),n?.querySelectorAll(".easytranslator-table-column-resize").forEach(t=>{t.style.left=e})}startWorkbookColumnResize(e,n,t){e.preventDefault(),e.stopPropagation();let i=this.workbookColumnKey(n,t.colId);this.workbookColumnResizeState={columnKey:i,startX:e.clientX,width:this.getWorkbookColumnWidth(n,t),min:t.minWidth,max:t.maxWidth||800}}workbookColumnKey(e,n){return`${e.name}:${n}`}getWorkbookColumnWidth(e,n){return this.workbookColumnWidths[this.workbookColumnKey(e,n.colId)]||n.width}updateWorkbookColumnWidth(e){let n=`${this.workbookColumnWidths[e]}px`;this.root?.querySelectorAll(`col[data-column-key='${st(e)}']`).forEach(t=>{t.style.width=n})}entityCheckbox(e){return d("input",{type:"checkbox",checked:!!this.selectedEntities[e.logicalName],on:{change:n=>{let t=n.currentTarget.checked;this.selectedEntities={...this.selectedEntities,[e.logicalName]:t},this.render()}}})}optionCheckbox(e,n){return d("label",{className:"easytranslator-check"},d("input",{type:"checkbox",checked:!!this.options[e],on:{change:t=>{this.options={...this.options,[e]:t.currentTarget.checked},this.render()}}}),d("span",{text:n}))}radio(e,n,t){return d("label",{className:"easytranslator-check"},d("input",{type:"radio",checked:e,on:{change:t}}),d("span",{text:n}))}toolButton(e,n,t,i=!1,o,r=!1){return d("button",{type:"button",className:`easytranslator-tool-action${r?" primary-blue":""}`,disabled:i,dataset:o?{action:o}:void 0,on:{click:s=>{s.preventDefault(),s.stopPropagation(),t()}}},gn(n),d("span",{text:e}))}button(e,n,t,i=!1,o){return d("button",{type:"button",className:n,text:e,disabled:i,dataset:o?{action:o}:void 0,on:{click:r=>{r.preventDefault(),r.stopPropagation(),t()}}})}linkButton(e,n){return d("button",{type:"button",className:"easytranslator-clear-link",text:e,on:{click:t=>{t.preventDefault(),n()}}})}getVisibleEntities(){let e=this.entityFilter.trim().toLowerCase();return e?this.entities.filter(n=>`${n.displayName} ${n.logicalName}`.toLowerCase().includes(e)):this.entities}getVisibleSheets(){return this.sheets.filter(e=>e.rows.length>0)}getActiveSheet(){let e=this.getVisibleSheets(),n=e.find(t=>t.name===this.activeSheet)||e[0]||null;return n&&n.name!==this.activeSheet&&(this.activeSheet=n.name),n}getActiveRows(e){if(!e)return[];let n=oe(this.rowFilter).split(/\s+/).filter(Boolean);return n.length===0?e.rows:e.rows.filter(t=>{let i=hn(t);return n.every(o=>i.includes(o))})}getChangedRows(){return this.sheets.flatMap(e=>e.rows).filter(H)}getChangedLocations(){let e=ae(this.languages,this.options);return this.getVisibleSheets().flatMap(n=>n.rows.flatMap((t,i)=>e.filter(o=>A(t,o)).map(o=>({sheetName:n.name,rowIndex:i,row:t,rowKey:rt(t),colId:`label-${o}`,language:o}))))}goToPendingChange(e){let n=this.getChangedLocations();if(n.length===0)return;let i=((this.changedCursor>=0?this.changedCursor:e>0?-1:0)+e+n.length)%n.length,o=n[i],r=`${o.rowKey}:${o.colId}`;this.changedCursor=i,this.focusedCellKey=r,this.rowFilter="",this.activeSheet=o.sheetName,this.workbookScrollTops[o.sheetName]=Math.max(0,(o.rowIndex-ie)*_),this.setMessage(`Pending change ${i+1} of ${n.length}: ${o.sheetName} row ${o.rowIndex+1}, ${Y(o.language)}`,"info"),this.render(),this.focusCell(r),window.setTimeout(()=>{this.focusedCellKey===r&&(this.focusedCellKey="",this.root?.querySelectorAll(".focused-change").forEach(s=>s.classList.remove("focused-change")))},900)}focusCell(e){let t=Array.from(this.root?.querySelectorAll("textarea[data-cell-key]")||[]).find(i=>i.dataset.cellKey===e);t&&(t.scrollIntoView({block:"center",inline:"center"}),t.focus())}updatePendingWidgets(){let e=this.getChangedLocations().length,n=this.getChangedRows().length,t=this.root?.querySelector("[data-action='pending']");t&&(t.textContent=`${e.toLocaleString()} pending changes`,t.disabled=e===0);let i=this.root?.querySelector("[data-action='save']");i&&(i.disabled=n===0||this.runState==="loading"||this.runState==="saving")}entityRelatedOptionsEnabled(){return this.options.entities||this.options.attributes||this.options.optionSets||this.options.booleans||this.options.views||this.options.charts||this.options.forms||this.options.dashboards||this.options.relationships}hasWorkbook(){return this.getVisibleSheets().length>0}setMessage(e,n){this.message=e,this.messageLevel=n;let t=this.root?.querySelector("[data-message='true']"),i=this.root?.querySelector("[data-message-text='true']");t&&(t.className=`easytranslator-message ${n}`),i&&(i.textContent=e)}requireClient(){return this.client||(this.client=de()),this.client}captureFocus(e){let n=e.dataset.focusKey;if(n)return{key:n,start:"selectionStart"in e?e.selectionStart:null,end:"selectionEnd"in e?e.selectionEnd:null}}restoreFocus(e){if(!e||!this.root)return;let n=this.root.querySelector(`[data-focus-key='${st(e.key)}']`);if(n&&(n.focus(),"setSelectionRange"in n&&e.start!==null&&e.end!==null))try{n.setSelectionRange(e.start,e.end)}catch{}}handleWorkbookScroll(e){let n=e.currentTarget,t=n.dataset.sheetName;if(!t)return;this.workbookScrollTops[t]=n.scrollTop,this.workbookScrollLefts[t]=n.scrollLeft,this.workbookGridHeights[t]=n.clientHeight;let i=this.getActiveSheet();if(!i||i.name!==t)return;let o=this.getActiveRows(i),r=this.getWorkbookVisibleCapacity(n.clientHeight);this.getWorkbookVisibleStart(n.scrollTop,o.length,r)!==(this.workbookRenderedStarts[t]||0)&&(this.workbookScrollFrame||(this.workbookScrollFrame=window.requestAnimationFrame(()=>{this.workbookScrollFrame=0;let s=this.getActiveSheet();if(!s||s.name!==t)return;let l=n.querySelector("tbody");if(!l)return;let u=this.getActiveRows(s),p=this.getWorkbookColumns(s,ae(this.languages,this.options));l.replaceChildren(...this.renderWorkbookRowElements(s,u,p,n.scrollTop,n.clientHeight))})))}restoreWorkbookScroll(){let e=this.root?.querySelector(".easytranslator-grid[data-sheet-name]"),n=e?.dataset.sheetName;if(!e||!n)return;let t=this.workbookScrollTops[n]||0;e.scrollTop!==t&&(e.scrollTop=t);let i=this.workbookScrollLefts[n]||0;e.scrollLeft!==i&&(e.scrollLeft=i),this.workbookGridHeights[n]=e.clientHeight}captureWorkbookTabsScroll(){let e=this.root?.querySelector(".easytranslator-tabs");e&&(this.workbookTabsScrollLeft=e.scrollLeft)}handleWorkbookTabsScroll(e){this.workbookTabsScrollLeft=e.currentTarget.scrollLeft}restoreWorkbookTabsScroll(){let e=this.root?.querySelector(".easytranslator-tabs");e&&e.scrollLeft!==this.workbookTabsScrollLeft&&(e.scrollLeft=this.workbookTabsScrollLeft)}getWorkbookVisibleCapacity(e){return Math.ceil(Math.max(_,e-pn)/_)}getWorkbookVisibleStart(e,n,t){let i=t+ie*2,o=Math.max(0,n-i);return Math.min(Math.max(0,Math.floor(e/_)-ie),o)}};function d(a,e={},...n){let t=document.createElement(a);return e.id&&(t.id=e.id),e.className&&(t.className=e.className),e.text!=null&&(t.textContent=e.text),e.title&&(t.title=e.title),e.type&&(t.type=e.type),e.value!=null&&(t.value=e.value),e.checked!=null&&(t.checked=e.checked),e.disabled!=null&&(t.disabled=e.disabled),Object.entries(e.style||{}).forEach(([i,o])=>{t.style.setProperty(i,o)}),Object.entries(e.attrs||{}).forEach(([i,o])=>t.setAttribute(i,o)),Object.entries(e.dataset||{}).forEach(([i,o])=>{t.dataset[i]=o}),Object.entries(e.on||{}).forEach(([i,o])=>t.addEventListener(i,o)),n.forEach(i=>{i==null||i===!1||t.appendChild(i instanceof Node?i:document.createTextNode(String(i)))}),e.value!=null&&t instanceof HTMLSelectElement&&(t.value=e.value),t}function mn(a,e,n,t,i){let o=e-a.startX,r=n-a.startY,s=a.left,l=a.top,u=a.width,p=a.height;if(a.edge.includes("e")&&(u=Math.max(t,a.width+o)),a.edge.includes("s")&&(p=Math.max(i,a.height+r)),a.edge.includes("w")){let c=Math.max(t,a.width-o);s=a.left+a.width-c,u=c}if(a.edge.includes("n")){let c=Math.max(i,a.height-r);l=a.top+a.height-c,p=c}return{left:Math.max(0,s),top:Math.max(0,l),width:u,height:p}}function gn(a){let e={load:"<path d='M12 3v12' /><path d='M7 10l5 5 5-5' /><path d='M5 21h14' />",save:"<path d='M5 4h12l2 2v14H5V4Z' /><path d='M8 4v6h8V4' /><path d='M8 16h8' />"},n=document.createElement("span");return n.className="easytranslator-svg-icon",n.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e[a]}</svg>`,n}function rt(a){return`${a.sheet}::${a.id}`}function hn(a){return oe([a.sheet,a.id,a.type,a.keyValues,Object.values(a.labels),Object.values(a.originalLabels),a.source])}function oe(a){return a==null?"":Array.isArray(a)?a.map(oe).join(" "):typeof a=="object"?Object.values(a).map(oe).join(" "):String(a).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[_-]/g," ").toLowerCase()}function bn(){let a=window;if(a.Xrm)return;let e=ct(window,new Set,0);e&&(a.Xrm=e.Xrm)}function ct(a,e,n){if(e.has(a)||n>4)return null;e.add(a);try{if(a.Xrm?.Utility?.getGlobalContext)return a}catch{return null}let t=[];try{a.parent&&a.parent!==a&&t.push(a.parent)}catch{}try{a.top&&a.top!==a&&t.push(a.top)}catch{}try{for(let i=0;i<a.frames.length;i+=1)t.push(a.frames[i])}catch{}for(let i of t){let o=ct(i,e,n+1);if(o)return o}return null}function st(a){let e=window.CSS?.escape;return e?e(a):a.replace(/['"\\#.:,[\]()]/g,"\\$&")}function fn(){if(document.getElementById("easytranslator-bookmarklet-styles"))return;let a=document.createElement("style");a.id="easytranslator-bookmarklet-styles",a.textContent=`
    .easytranslator-shell {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      pointer-events: none;
      font-family: "Segoe UI", Tahoma, Arial, sans-serif !important;
      color: #111827;
    }
    .easytranslator-shell button,
    .easytranslator-shell input,
    .easytranslator-shell select,
    .easytranslator-shell textarea {
      font-family: "Segoe UI", Tahoma, Arial, sans-serif !important;
    }
    .easytranslator-shell,
    .easytranslator-shell * {
      box-sizing: border-box;
      font-family: "Segoe UI", Tahoma, Arial, sans-serif !important;
    }
    .easytranslator-panel {
      pointer-events: auto;
      position: fixed;
      left: 50%;
      top: 24px;
      transform: translateX(-50%);
      width: min(1320px, calc(100vw - 24px));
      height: min(760px, calc(100vh - 48px));
      min-width: min(720px, calc(100vw - 8px));
      min-height: min(560px, calc(100vh - 32px));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #ffffff;
      border: 1px solid #d7e0ec;
      border-radius: 18px;
      box-shadow: 0 30px 90px rgba(15, 23, 42, 0.35);
    }
    .easytranslator-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      min-height: 74px;
      padding: 18px 22px 17px;
      background: rgba(255, 255, 255, 0.94);
      border-bottom: 1px solid #e2e8f0;
      backdrop-filter: blur(14px);
      cursor: move;
      user-select: none;
    }
    .easytranslator-page-title {
      min-width: 0;
    }
    .easytranslator-header h1 {
      margin: 0;
      color: #0f172a;
      font-size: 22px;
      line-height: 1.15;
      font-weight: 950;
    }
    .easytranslator-header p {
      max-width: 560px;
      margin: 5px 0 0;
      color: #16a34a;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .easytranslator-actions,
    .easytranslator-row-actions,
    .easytranslator-changed-nav {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .easytranslator-actions button,
    .easytranslator-row-actions button,
    .easytranslator-changed-nav button,
    .easytranslator-tabs button {
      border: 1px solid #cfd8e5;
      background: #fff;
      color: #1f2a44;
      border-radius: 7px;
      min-height: 32px;
      padding: 6px 11px;
      font: 600 12px "Segoe UI", Tahoma, Arial, sans-serif;
      cursor: pointer;
    }
    .easytranslator-actions button,
    .easytranslator-row-actions button {
      border: 1px solid #dbe3ef;
      background: #ffffff;
      color: #334155;
      cursor: pointer;
      font-weight: 850;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      transition: box-shadow 160ms ease, transform 160ms ease, background-color 160ms ease, color 160ms ease;
    }
    .easytranslator-actions button {
      width: auto;
      min-width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0 13px;
      border-radius: 13px;
      font-size: 12px;
    }
    .easytranslator-actions button:hover,
    .easytranslator-row-actions button:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
    }
    .easytranslator-actions button.primary,
    .easytranslator-row-actions button.primary {
      background: #0f172a;
      border-color: #0f172a;
      color: #fff;
    }
    .easytranslator-tool-action.primary-blue {
      border-color: #2563eb !important;
      color: #ffffff !important;
      background: #2563eb !important;
    }
    .easytranslator-tool-action.primary-blue:disabled {
      border-color: #93c5fd !important;
      background: #93c5fd !important;
    }
    .easytranslator-actions button:disabled,
    .easytranslator-row-actions button:disabled,
    .easytranslator-changed-nav button:disabled {
      cursor: not-allowed;
      opacity: 0.65;
    }
    .easytranslator-svg-icon {
      display: inline-grid;
      place-items: center;
      width: 15px;
      height: 15px;
      color: currentColor;
    }
    .easytranslator-svg-icon svg {
      display: block;
      width: 15px;
      height: 15px;
    }
    .easytranslator-body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      overflow: auto;
      background: #f6f8fb;
    }
    .easytranslator-message {
      border-radius: 8px;
      border: 1px solid #bfdbfe;
      background: #eff6ff;
      color: #174ea6;
      padding: 10px 12px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .easytranslator-message button {
      border: 1px solid #b9c8da;
      border-radius: 8px;
      background: #fff;
      color: #172033;
      padding: 6px 10px;
      font: 700 12px "Segoe UI", Tahoma, Arial, sans-serif;
      cursor: pointer;
      flex: 0 0 auto;
      min-height: 32px;
    }
    .easytranslator-message.success {
      border-color: #b7ebc6;
      background: #effaf2;
      color: #087333;
    }
    .easytranslator-message.error {
      border-color: #ffc7c7;
      background: #fff1f1;
      color: #a4262c;
    }
    .easytranslator-config {
      min-height: 430px;
      display: grid;
      grid-template-columns: minmax(320px, 390px) minmax(0, 1fr);
      gap: 12px;
      min-width: 0;
    }
    .easytranslator-card {
      background: #fff;
      border: 1px solid #dbe3ef;
      border-radius: 8px;
      overflow: hidden;
      min-width: 0;
    }
    .easytranslator-card.entity-picker {
      display: flex;
      flex-direction: column;
      min-height: 430px;
    }
    .easytranslator-card-head,
    .easytranslator-workbook-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 12px;
      border-bottom: 1px solid #e3eaf3;
    }
    .easytranslator-option-box-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }
    .easytranslator-option-box-head.wide {
      grid-column: 1 / -1;
    }
    .easytranslator-card h2,
    .easytranslator-option-box h2 {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
      color: #111827;
    }
    .easytranslator-card-head h2,
    .easytranslator-option-box-head h2 {
      margin: 0;
    }
    .easytranslator-field {
      display: grid;
      gap: 4px;
      padding: 10px 12px 0;
      font-size: 12px;
      font-weight: 600;
    }
    .easytranslator-field select,
    .easytranslator-filter,
    .easytranslator-workbook-top input,
    .easytranslator-option-box select {
      min-height: 32px;
      border: 1px solid #ccd8e6;
      border-radius: 7px;
      background: #fff;
      color: #111827;
      padding: 6px 9px;
      font: 12px "Segoe UI", Tahoma, Arial, sans-serif;
    }
    .easytranslator-field select {
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }
    .easytranslator-filter {
      margin: 10px 12px;
      width: calc(100% - 24px);
    }
    .easytranslator-entities {
      flex: 1 1 auto;
      min-height: 290px;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      border-top: 1px solid #e3eaf3;
      border-bottom: 1px solid #e3eaf3;
    }
    .easytranslator-entities table,
    .easytranslator-grid-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .easytranslator-entities table {
      table-layout: fixed;
      min-width: 0;
    }
    .easytranslator-entity-display-col {
      width: 185px;
    }
    .easytranslator-entities th,
    .easytranslator-grid-table th {
      position: sticky;
      top: 0;
      z-index: 1;
      background: #eff3f8;
      color: #172033;
      text-align: left;
      font-weight: 700;
      border-bottom: 1px solid #d7e0ec;
    }
    .easytranslator-entities th,
    .easytranslator-entities td,
    .easytranslator-grid-table th,
    .easytranslator-grid-table td {
      border-right: 1px solid #dbe3ef;
      border-bottom: 1px solid #dbe3ef;
      padding: 7px 8px;
      vertical-align: top;
    }
    .easytranslator-entities th,
    .easytranslator-entities td {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .easytranslator-entities th:first-child,
    .easytranslator-entities td:first-child {
      width: auto;
      min-width: 130px;
    }
    .easytranslator-entities th:nth-child(2),
    .easytranslator-entities td:nth-child(2) {
      min-width: 130px;
      white-space: nowrap;
    }
    .easytranslator-table-column-resize {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 14px;
      height: 100%;
      cursor: col-resize;
      z-index: 4;
      touch-action: none;
      transform: translateX(-50%);
      background: transparent;
    }
    .easytranslator-entity-label,
    .easytranslator-check {
      display: flex;
      align-items: center;
      gap: 6px;
      min-height: 22px;
      color: #172033;
      font-size: 12px;
    }
    .easytranslator-entity-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .easytranslator-entity-label input {
      flex: 0 0 auto;
    }
    .easytranslator-mini {
      padding: 7px 12px;
      color: #52627a;
      font-size: 12px;
    }
    .easytranslator-options-grid,
    .easytranslator-card.options-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 310px);
      gap: 10px;
      padding: 12px;
      align-content: start;
    }
    .easytranslator-option-box {
      border: 1px solid #e1e7f0;
      background: #fbfdff;
      border-radius: 8px;
      padding: 10px;
    }
    .easytranslator-translation-row-filter {
      display: grid !important;
      grid-template-columns: 42px minmax(0, 1fr);
      margin-top: 6px;
    }
    .easytranslator-translation-row-filter select {
      width: 100%;
      min-width: 0;
    }
    .easytranslator-option-box.wide {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(2, minmax(180px, 1fr));
      gap: 8px 16px;
    }
    .easytranslator-option-box.label-options {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }
    .easytranslator-option-box.label-options h2 {
      margin: 0;
      display: flex;
      align-items: center;
      min-height: 22px;
    }
    .easytranslator-option-box.label-options > span {
      display: flex;
      align-items: center;
      min-height: 22px;
      color: #172033;
      font-size: 12px;
      font-weight: 400;
    }
    .easytranslator-option-box label {
      display: flex;
      align-items: center;
      gap: 6px;
      min-height: 22px;
      color: #172033;
      font-size: 12px;
    }
    .easytranslator-clear-link {
      border: 0;
      background: transparent;
      color: #005fb8;
      padding: 0;
      font: 600 12px "Segoe UI", Tahoma, Arial, sans-serif;
      text-decoration: underline;
      cursor: pointer;
    }
    .easytranslator-workbook {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #dbe3ef;
      border-radius: 8px;
      background: #fff;
    }
    .easytranslator-workbook-top input {
      width: min(360px, 45%);
    }
    .easytranslator-grid {
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
    .easytranslator-grid-table {
      table-layout: fixed;
      width: max-content;
      min-width: 100%;
    }
    .easytranslator-grid-table th {
      white-space: nowrap;
      height: 36px;
      padding: 4px 8px;
      line-height: 18px;
      position: sticky;
      vertical-align: middle;
    }
    .easytranslator-grid-table td {
      background: #fff;
      height: 52px;
      line-height: 18px;
      vertical-align: middle;
    }
    .easytranslator-grid-table td.row-number {
      width: 46px;
      min-width: 46px;
      text-align: center;
      color: #536274;
      background: #f7f9fc;
    }
    .easytranslator-grid-table td.key-cell {
      white-space: nowrap;
    }
    .easytranslator-grid-table tr.easytranslator-virtual-spacer td {
      padding: 0;
      border-right: 0;
      border-bottom: 0;
      background: #fff;
    }
    .easytranslator-grid-table th.row-number-header {
      text-align: center;
      padding: 4px;
    }
    .easytranslator-header-label {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 18px;
    }
    .easytranslator-column-resize {
      position: absolute;
      top: 0;
      right: -7px;
      width: 14px;
      height: 100%;
      cursor: col-resize;
      z-index: 4;
      touch-action: none;
      background: transparent;
    }
    .easytranslator-grid-table td.changed {
      background: #dcfce7;
      box-shadow: inset 0 0 0 2px #22c55e;
    }
    .easytranslator-grid-table td.focused-change {
      animation: easytranslator-change-flash 900ms ease;
    }
    @keyframes easytranslator-change-flash {
      0%, 100% { box-shadow: inset 0 0 0 2px #22c55e; }
      20%, 70% { box-shadow: inset 0 0 0 2px rgba(249, 115, 22, 0.75); }
    }
    .easytranslator-grid-table textarea {
      width: 100%;
      min-width: 220px;
      height: 18px;
      min-height: 18px;
      resize: none;
      border: 0;
      outline: 0;
      background: transparent;
      font: 12px "Segoe UI", Tahoma, Arial, sans-serif;
      line-height: 18px;
      padding: 0;
      margin: 0;
      box-shadow: none;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: pre;
      scrollbar-width: none;
      -ms-overflow-style: none;
      appearance: none;
      -webkit-appearance: none;
    }
    .easytranslator-grid-table textarea::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
    }
    .easytranslator-grid-table textarea:focus,
    .easytranslator-grid-table textarea:focus-visible {
      border: 0 !important;
      outline: 0 !important;
      box-shadow: none !important;
    }
    .easytranslator-tabs {
      display: flex;
      gap: 0;
      overflow-x: auto;
      padding: 0 8px;
      background: #fff;
      border-top: 1px solid #dbe3ef;
    }
    .easytranslator-tabs button {
      flex: 0 0 auto;
      margin-top: -1px;
      border-top: 0;
      border-radius: 0 0 5px 5px;
      background: #f8fafc;
    }
    .easytranslator-tabs button.active {
      background: #fff;
      color: #111827;
      border-bottom: 2px solid #16a34a;
      font-weight: 700;
    }
    .easytranslator-empty {
      padding: 24px;
      color: #52627a;
      font-size: 13px;
    }
    .easytranslator-resize {
      position: absolute;
      z-index: 2;
    }
    .easytranslator-resize.n,
    .easytranslator-resize.s {
      left: 10px;
      right: 10px;
      height: 8px;
      cursor: ns-resize;
    }
    .easytranslator-resize.n { top: 0; }
    .easytranslator-resize.s { bottom: 0; }
    .easytranslator-resize.e,
    .easytranslator-resize.w {
      top: 10px;
      bottom: 10px;
      width: 8px;
      cursor: ew-resize;
    }
    .easytranslator-resize.e { right: 0; }
    .easytranslator-resize.w { left: 0; }
    .easytranslator-resize.ne,
    .easytranslator-resize.nw,
    .easytranslator-resize.se,
    .easytranslator-resize.sw {
      width: 14px;
      height: 14px;
    }
    .easytranslator-resize.ne { top: 0; right: 0; cursor: nesw-resize; }
    .easytranslator-resize.nw { top: 0; left: 0; cursor: nwse-resize; }
    .easytranslator-resize.se { bottom: 0; right: 0; cursor: nwse-resize; }
    .easytranslator-resize.sw { bottom: 0; left: 0; cursor: nesw-resize; }
    @media (max-width: 860px) {
      .easytranslator-panel {
        top: 4px;
        width: calc(100vw - 8px);
        height: calc(100vh - 8px);
      }
      .easytranslator-header,
      .easytranslator-card-head,
      .easytranslator-workbook-top {
        align-items: flex-start;
        flex-direction: column;
      }
      .easytranslator-config,
      .easytranslator-card.options-grid,
      .easytranslator-option-box.wide {
        grid-template-columns: 1fr;
      }
      .easytranslator-workbook-top input {
        width: 100%;
      }
    }
  `,document.head.appendChild(a)}var lt=window.EasyTranslatorBookmarklet;if(lt)lt.open();else{let a=new xe;window.EasyTranslatorBookmarklet={open:()=>a.open(),close:()=>a.close(),isOpen:()=>a.isOpen()},a.open()}})();
