import { View } from 'react-native';
import React, { ReactNode } from 'react';

interface IProps {
    justify?: 'space-between' | 'space-around' | 'flex-start' | 'flex-end' | 'center';
    align?: 'space-between' | 'space-around' | 'flex-start' | 'flex-end' | 'center';
    fullWidth?: boolean;
    children: ReactNode;
}

const Row = ({ children, justify = 'space-between', align = 'center', fullWidth = true }: IProps) => {
    return (
        <View
            style={
                {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: justify,
                    alignItems: align,
                    width: fullWidth ? '100%' : undefined,
                } as any
            }
        >
            {children}
        </View>
    );
};

export default Row;
