<template>

<div>
  <h1>Upcoming Observations</h1> 
 <a-card style="width: 1400px">
    <p>You have an upcoming observation of {} by {} on {} from {} in {}</p>

  <p>View course and seminar details </p> 

 <a-button type="danger">
     Cancel
    </a-button>
<br /> 
<br /> 
     <a-button type="primary">
     Accepted
    </a-button>
  </a-card>
    
    <br /> 
<a-button type="link" block>
     View all completed observations
    </a-button>

  <br />
    <h1>My Requests</h1> 
 <a-card style="width: 1400px">
     <p>You requested to observe {} by {} on {} from {} in {}</p>

  <p>View course and seminar details </p> 

 <a-button type="danger">
     View all previous outgoing requests
    </a-button>
<br /> 
<br /> 
     <a-button type="primary">
     Accept
    </a-button>
  </a-card>
      
    <br /> 
<a-button type="link" block>
    View all previous outgoing requests
    </a-button>
      <br />
        <h1>Incoming Requests</h1> 
 <a-card style="width: 1400px">
    <p>{} requested to observe your course {} on {} from {} in {}.</p>

  <p>View course and seminar details </p> 

   <a-button  shape="circle" icon="close" />
     <br />
       <br />

  <a-button type="primary" shape="circle" icon="check" />
        
<br /> 
<br /> 

  </a-card>
    
    <br /> 
<a-button type="link" block>
       View all previous incoming requests
    </a-button>
    <br />


</div>
</template>
<script>
export default {
  methods: {
    handleMenuClick(e) {
      console.log('click', e);
    },
  },
};
</script>