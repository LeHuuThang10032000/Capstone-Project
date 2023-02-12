<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateColWithdrawRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('withdraw_request',function(Blueprint $table) {
            $table->dropColumn(['name', 'phone', 'email', 'mssv', 'reason']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('withdraw_request',function(Blueprint $table){
            $table->string('name');
            $table->string('phone');
            $table->string('email');
            $table->string('mssv');
            $table->string('reason');
        });
    }
}
