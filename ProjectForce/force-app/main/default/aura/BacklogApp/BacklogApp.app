<aura:application extends="force:slds"> 
        <div class="slds-m-around_medium">
    <lightning:tabset selectedTabId="Tasks">
        <lightning:tab label="View" id="View">
            View Content !
        </lightning:tab>
        <lightning:tab label="Tasks" id="Tasks">
            <c:BacklogAccordion/>
        </lightning:tab>
        <lightning:tab label="Backlog" id="Backlog">
            <c:KanbanProject/>
        </lightning:tab>
    </lightning:tabset>
    </div>
</aura:application>	
