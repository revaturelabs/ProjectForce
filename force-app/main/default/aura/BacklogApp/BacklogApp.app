<aura:application extends="force:slds"> 
    <aura:attribute name="project" type="String" default=""/>
    <div class="slds-m-around_medium">
        <lightning:tabset selectedTabId="Tasks">
            <lightning:tab label="Tasks" id="Tasks" onactive="{!c.refresh}">
                <c:BacklogAccordion project="{!v.project}" aura:id="accordionView"/>
            </lightning:tab>
            <lightning:tab label="Backlog" id="Backlog">
                <c:KanbanProject project="{!v.project}"/>
            </lightning:tab>
        </lightning:tabset>
    </div>
</aura:application>