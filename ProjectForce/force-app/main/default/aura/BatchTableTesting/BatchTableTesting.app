<aura:application extends="force:slds">

    <aura:attribute name="tableHeight" type="String" default="400" />
    <aura:attribute name="tableWidth" type="String" default="500" />
    <aura:handler name="tableItemSelected" event="c:TableItemSelectedEvent" action="{!c.handleItemSelectedEvent}" />
    <aura:handler name="saveInlineEdits" event="c:saveInlineEditsEvent" action="{!c.handleSaveInlineEditsEvent}" />

    <div class="a">
        <c:CreateDataTable width="{!v.tableWidth}" height="{!v.tableHeight}"
            queryObject="Training__c" 
            tableHeader="Batch Table" 
            queryFields="['Name', 'Start_Date__c']" />
        <c:CreateDataTable width="{!v.tableWidth}" height="{!v.tableHeight}"
            queryObject="Project__c" 
            tableHeader="Project Table" 
            queryFields="['Name']" />
    </div>
</aura:application>	
