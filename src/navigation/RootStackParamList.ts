// src/navigation/RootStackParamList.ts

export type RootStackParamList = {
    Splash: undefined;
    Signup: undefined;
    Onboarding: { 
        userId: string;
      };    
    Login: undefined;
    Feed: { 
        userId: string;
      };
    Profile: { 
        userId: string;
      };
    MakePost: { 
        userId: string;
      };};


