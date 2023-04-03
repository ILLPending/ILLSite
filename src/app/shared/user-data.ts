export interface Roles {
    reader?: boolean;
    admin?: boolean;
}

export interface UserData {
    //Base info that is required
    id?: string;
    uid?: string;
    permissions?: string;
    username?: string;
    verified?: boolean;

    //Profile info that is optional
    gd_username?: string; //used to display pfps inside of the levels themselves
    description?: string;
    avatar?: File;
    avatar_url?: string;
    badges?: string; //basically roles like list mod, list helper, botter and etc.

    //ILLP related things
    illp_points?: number;

    //Creator related stuff
    ill_verified?: boolean;
    created_levels?: number;

    //bans and such
    show_in_leaderboards?: boolean;
    banned_from_leaderboards?: boolean;
    banned_from_wrs?:boolean;
}
